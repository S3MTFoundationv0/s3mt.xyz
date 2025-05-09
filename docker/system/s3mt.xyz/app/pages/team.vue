<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-16 text-white">Our Team</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
      <TeamMemberCard
        v-for="member in teamMembers"
        :key="member.name"
        :name="member.name"
        :title="member.title"
        :bio="member.bio"
        :image-url="member.imageUrl"
        :social-links="member.socialLinks"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TeamMemberCard from '~/components/TeamMemberCard.vue'

useHead({
  title: 'Our Team - S3MT',
  meta: [
    { name: 'description', content: 'Meet the dedicated team behind S3MT.' }
  ]
})

// Define team member data (replace with actual data fetching if needed)
const teamMembers = [
  {
    name: 'John Michael Francis',
    title: 'CEO and coordinator of JMF Solutions',
    bio: "My passions in business revolve around leadership, entrepreneurship, and technology with a focus on making a real difference with Technology. The Internet was designed to be free and open to everyone globally. It is our most powerful tool, we should protect it and use it wisely. AI, ML, Blockchain and Crypto are the next evolution of this, and are free to everyone and are changing the world as we know it. I work to bring those things together and to foster ideas leading to innovation and effective efficiency.",
    imageUrl: '~/assets/images/team/mike_francis_ghibli.png',
    socialLinks: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mifrancis/' }
    ]
  },
  {
    name: 'Blaine Francis',
    title: 'Marketing Manager',
    bio: "Originally from Fairhope, AL and a graduate of Spring Hill College (Mobile, AL) with a Bachelor's Degree in Business Administration with a concentration in Management and Marketing.  Have 5+ years of experience in digital marketing and social media management as well as 2+ years of experience in customer support across more than 10 different brands in both B2B and B2C markets. Currently working remotely based out of Birmingham, AL.",
    imageUrl: '~/assets/images/team/blain.png',
    socialLinks: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gblainefrancis/' }
    ]
  },
  {
    name: 'Juan Pablo Perez Calva',
    title: 'Founder & CEO / Fintech / Payments&Lending / Financial Products',
    bio: 'Financial Inclusion / Healthtech / Latitud Fellow',
    imageUrl: '~/assets/images/team/juan_pablo_perez_calva_ghibli.png',
    socialLinks: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/juan-pablo-perez-calva-7773719b/' }
    ]
  },
  {
    name: 'Juan Carlos Rodriguez Paniagua',
    title: 'Homeland Cloud Software',
    bio: 'I have been in information technologies for more than 20 years. We have created solutions…',
    imageUrl: '~/assets/images/team/juan_rodriguez_ghibli.png',
    socialLinks: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jcrod/' }
    ]
  },
  {
    name: 'Kenny Hash',
    title: 'Developer',
    bio: "With 20+ years of experience, Kenny serves in technical leadership across several organizations. He's a proud active contributor to the open source community. He possesses a diverse range of skills from CSS to DevOps to expert AI prompting. He strives to create value for companies that change the world.",
    imageUrl: '~/assets/images/team/kenny_ghibli.png',
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/web-mech' }
    ]
  },
  {
    name: 'Josh Dunn',
    title: 'Digital Marketing Specialist',
    bio: "I've been helping companies establish a reputable online brand and convert incoming traffic to paying customers for the last 5 years. My background is in digital marketing and inbound marketing through web development, social media management, content creation, livestreaming, and more.",
    imageUrl: '~/assets/images/team/josh_dunn_ghibli.png',
    socialLinks: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/joshuabdunn/' }
    ]
  }
]

</script>

<style scoped>
/* Scoped styles specific to the team page layout can remain here */
/* Styles for the cards themselves have been moved to TeamMemberCard.vue */
</style>
