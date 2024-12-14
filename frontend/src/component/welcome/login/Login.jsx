
import  LoginForm  from "./LoginForm"

import taps from '../../../assets/taps.jpg'
import logo from '../../../assets/shantipatra.png'

export default function Login() {
  return (
    <>
   
      
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src={taps}
            alt="Adhesive Tape Background"
            // layout="fill"
            className=" h-full w-full bg-cover object-cover"
            // objectFit="cover"
            // objectPosition="center"
            priority
          />
          <div className="absolute inset-0 bg-zinc-900/50" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            src={logo}
            alt="Shanti Patra Plastic PVT. LTD. Logo"
            width={300}
            height={300}
          />
          {/* <span className="ml-2">Shanti Patra Plastic PVT. LTD.</span> */}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Pioneers in the tape industry, offering water-based acrylic emulsion self-adhesive BOPP Tapes for more than 20 years.&rdquo;
            </p>
            <footer className="text-sm">Mr. Jitendra Desai & Mr. Darshan Desai</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By logging in, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

