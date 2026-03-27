import { FacebookIcon, GithubIcon, InstagramIcon, TwitterIcon } from 'lucide-react'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type TeamMember = {
  image: string
  alt: string
  name: string
  role: string
  description: string
  socialLinks: {
    facebook?: string
    twitter?: string
    github?: string
    instagram?: string
  }
}[]

const socialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
}

const Team = ({ teamMembers }: { teamMembers: TeamMember }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center sm:mb-16 lg:mb-24'>
          <h2 className='mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl'>Conoce a nuestro equipo</h2>
          <p className='text-muted-foreground text-xl'>
            Las personas detras de los proyectos que construimos.
          </p>
        </div>

        {/* Team Members */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-4'>
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className='hover:border-primary overflow-hidden py-0 shadow-none transition-colors duration-300'
            >
              <CardContent className='px-0'>
                <div className='bg-muted pt-10'>
                  <img src={member.image} alt={member.alt} className='mx-auto h-60 w-auto' />
                </div>
                <div className='space-y-3 p-6'>
                  <CardTitle className='text-lg'>{member.name}</CardTitle>
                  <Separator />
                  <div className='text-muted-foreground'>
                    <p className='mb-1 font-medium'>{member.role}</p>
                    <p>{member.description}</p>
                  </div>
                  <div className='flex gap-3'>
                    {Object.entries(member.socialLinks).map(([platform, url]) => {
                      if (!url) return null
                      const Icon = socialIcons[platform as keyof typeof socialIcons]
                      if (!Icon) return null
                      return (
                        <a key={platform} href={url}>
                          <Icon className='size-5' />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
