import {
    MusicNoteIcon,
    HeadphonesIcon,
    MicrophoneIcon,
  } from '../icons'
  
  export default function About() {
    const owners = [
      {
        name: 'Suraj Chigati',
        image: '/owners/alex.jpg', // update with your actual image paths
        bio: 'Suraj is sigma',
      },
      {
        name: 'Eeshan Desai',
        image: '/owners/taylor.jpg',
        bio: 'the gay one',
      },
      {
        name: 'Aadi Tiwari',
        image: '/owners/jordan.jpg',
        bio: 'Aadi is alpha wolf',
      },
    ]
  
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-red-100 px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="text-center">
            <h1 className="text-5xl font-extrabold mb-6 tracking-wide text-black drop-shadow-sm">
              About Spotavibe
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light text-gray-900">
              Spotavibe is a passionate community dedicated to supporting the next generation of music artists.
              We believe every rising star deserves a chance to shine — and with your help, we make that happen.
              Join us as we discover fresh talent, invest in their journeys, and shape the future of sound together.
            </p>
          </header>
  
          {/* Icons Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center text-purple-700 mb-16">
            {[MusicNoteIcon, HeadphonesIcon, MicrophoneIcon].map((Icon, i) => (
              <div
                key={i}
                className="transform transition-transform duration-700 hover:scale-150 hover:text-purple-950 cursor-pointer animate-pulse"
                aria-label="Music icon"
              >
                <Icon className="w-36 h-36 drop-shadow-xl" />
              </div>
            ))}
          </div>
  
          {/* About the Owners Section */}
          <section>
            <h2 className="text-4xl font-bold mb-10 text-center tracking-wide text-black drop-shadow-sm">
              Meet the Owners
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {owners.map(({ name, image, bio }) => (
                <div
                  key={name}
                  className="bg-white rounded-lg p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <img
                    src={image}
                    alt={`${name}'s photo`}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-purple-700 shadow-md"
                  />
                  <h3 className="text-2xl font-semibold mb-2 text-purple-800">
                    {name}
                  </h3>
                  <p className="text-gray-800 font-medium">{bio}</p>
                </div>
              ))}
            </div>
          </section>
  
          <blockquote className="max-w-3xl mx-auto italic text-center text-gray-800 font-light drop-shadow-sm px-6">
            “Empowering artists. Connecting communities. Amplifying dreams.”
          </blockquote>
        </div>
      </section>
    )
  }
  