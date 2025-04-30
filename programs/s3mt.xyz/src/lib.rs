use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("5tz5xFvHNnJViiCZ3iHdgqrTC1GfcEvnB49KoxvQpR3D"); // Replace with your program ID after deployment

#[program]
pub mod s3mt_presale {
    use super::*;

    // Initializes the presale configuration
    pub fn initialize(ctx: Context<Initialize>, treasury: Pubkey, usdc_mint: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = *ctx.accounts.admin.key;
        config.treasury = treasury;
        config.usdc_mint = usdc_mint;
        config.paused = false;
        msg!("Presale initialized: admin={}, treasury={}, usdc_mint={}", config.admin, config.treasury, config.usdc_mint);
        Ok(())
    }

    // Purchase with USDC: front-end provides usdc_amount and s3mt_amount
    pub fn purchase_usdc(ctx: Context<PurchaseUsdc>, usdc_amount: u64, s3mt_amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, PresaleError::SalePaused);
        require!(usdc_amount > 0, PresaleError::ZeroAmount);
        require!(s3mt_amount > 0, PresaleError::ZeroAmount);

        // Transfer USDC from buyer to treasury
        let cpi_accounts = Transfer {
            from: ctx.accounts.buyer_usdc_account.to_account_info(),
            to: ctx.accounts.treasury_usdc_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, usdc_amount)?;

        // Emit event with purchase details
        emit!(PurchaseEvent {
            buyer: *ctx.accounts.buyer.key,
            usdc_amount,
            sol_amount: 0,
            s3mt_amount,
            timestamp: ctx.accounts.clock.unix_timestamp,
        });
        Ok(())
    }

    // Purchase with SOL: front-end provides sol_amount and s3mt_amount
    pub fn purchase_sol(ctx: Context<PurchaseSol>, sol_amount: u64, s3mt_amount: u64) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(!config.paused, PresaleError::SalePaused);
        require!(sol_amount > 0, PresaleError::ZeroAmount);
        require!(s3mt_amount > 0, PresaleError::ZeroAmount);

        // Transfer SOL from buyer to treasury
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.treasury.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
        system_program::transfer(cpi_ctx, sol_amount)?;

        emit!(PurchaseEvent {
            buyer: *ctx.accounts.buyer.key,
            usdc_amount: 0,
            sol_amount,
            s3mt_amount,
            timestamp: ctx.accounts.clock.unix_timestamp,
        });
        Ok(())
    }

    // Allows admin to update configuration
    pub fn update_config(ctx: Context<UpdateConfig>, treasury: Option<Pubkey>, paused: Option<bool>, usdc_mint: Option<Pubkey>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        if let Some(t) = treasury {
            config.treasury = t;
            msg!("Treasury updated to {}", t);
        }
        if let Some(p) = paused {
            config.paused = p;
            msg!("Paused set to {}", p);
        }
        if let Some(m) = usdc_mint {
            config.usdc_mint = m;
            msg!("USDC Mint updated to {}", m);
        }
        Ok(())
    }
}

// --- Accounts ---

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init, payer = admin, space = 8 + Config::SIZE, seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseUsdc<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut, associated_token::mint = config.usdc_mint, associated_token::authority = buyer)]
    pub buyer_usdc_account: Account<'info, TokenAccount>,
    #[account(mut, associated_token::mint = config.usdc_mint, associated_token::authority = config.treasury)]
    pub treasury_usdc_account: Account<'info, TokenAccount>,
    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    #[account(address = config.usdc_mint)]
    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct PurchaseSol<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut, address = config.treasury)]
    /// CHECK: This is the treasury account to receive SOL payments.
    pub treasury: AccountInfo<'info>,
    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, Config>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump, has_one = admin)]
    pub config: Account<'info, Config>,
}

// --- State ---

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub usdc_mint: Pubkey,
    pub paused: bool,
}

impl Config {
    pub const SIZE: usize = 32 + 32 + 32 + 1;
}

// --- Events ---

#[event]
pub struct PurchaseEvent {
    pub buyer: Pubkey,
    pub usdc_amount: u64,
    pub sol_amount: u64,
    pub s3mt_amount: u64,
    pub timestamp: i64,
}

// --- Errors ---

#[error_code]
pub enum PresaleError {
    #[msg("Sale is paused")]
    SalePaused,
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
}