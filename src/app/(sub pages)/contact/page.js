import Image from "next/image";
import bg from "../../../../public/background/dino.png";
import Form from '../../../components/contact/Form';

export default function Contact() {
  return (
    <main>
      <Image
        src={bg}
        alt="background-image"
        priority sizes="100vw"
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-25"
        />

        <article className="relative w-full flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center justify-center space-y-6 w-3/4">
            <h1 className="text-accent font-semibold text-center text-4xl capitalize">
              Contact Me
            </h1>
            <p className="text-center font-light">
              Use the form below to send your message and I will get back to you shortly!
            </p>

          </div>
          <Form />

        </article>
        


    </main>
  );
}