
import Image from 'next/image'
import LOGO from '@/public/assets/Logo.webp'
import Link from 'next/link'

function SinvphLogo() {
  return (
    <Link href={'/'}>
        <Image src={LOGO} alt='SINVPH' className='b bg-blend-lighten  pointer-events-none' width={100} height={100}/>
    </Link>
  )
}

export default SinvphLogo