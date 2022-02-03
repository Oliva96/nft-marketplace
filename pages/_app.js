import Head from 'next/head'
import Link from 'next/link'
import '../styles/globals.css'
import NavbarHome from '../components/Navbar';
import Footer from '../components/Footer';


function MyApp({ Component, pageProps }) {
  return (
    <div className="leading-normal tracking-normal text-indigo-400 bg-cover bg-fixed" style={{backgroundImage: `url('./back.jpg')`}}>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Rainblur Landing Page Template: Tailwind Toolbox</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"/>
        <link href="https://unpkg.com/@tailwindcss/custom-forms/dist/custom-forms.min.css" rel="stylesheet" />
      </Head>
      <NavbarHome/>
      <div className="h-screen pt-24" >
        <Component {...pageProps} />
      </div>
      <Footer/>
    </div>
  )
}

export default MyApp
