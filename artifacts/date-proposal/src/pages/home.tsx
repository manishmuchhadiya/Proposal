import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from '../components/Confetti';
import { Celebration } from '../components/Celebration';
import { Heart, ArrowRight, Calendar, Clock, Pizza, Fish, UtensilsCrossed, Utensils, Flame, Soup, Car } from 'lucide-react';

import dogGif from '@assets/0_dog_1783750334483.gif';
import ladyTrampGif from '@assets/2_lady-and_1783750334492.gif';
import cuteDogGif from '@assets/1_doggy-cute_1783750334490.gif';

type Step = 1 | 2 | 3 | 4 | 5;

const FOOD_OPTIONS = [
  { id: 'pizza', label: 'Pizza', icon: Pizza },
  { id: 'sushi', label: 'Sushi Rolls', icon: Fish },
  { id: 'noodles', label: 'Noodles', icon: UtensilsCrossed },
  { id: 'pasta', label: 'Pasta', icon: Utensils },
  { id: 'sizzler', label: 'Sizzler', icon: Flame },
  { id: 'indian', label: 'Indian', icon: Soup },
];

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  
  // Step 1 State
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [noClicks, setNoClicks] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Step 3 State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Step 4 State
  const [food, setFood] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjkeegq';

  const submitProposal = (selectedFood: string | null) => {
    if (submitted) return;
    setSubmitted(true);
    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: 'She said YES! Date details inside 💌',
        date,
        time,
        food: selectedFood,
      }),
    }).catch(() => {
      // Fail silently -- never block the celebratory flow on a network hiccup.
      setSubmitted(false);
    });
  };

  const formattedTime = (() => {
    if (!time) return '6';
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr, 10);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return minutesStr === '00' ? `${displayHours} ${period}` : `${displayHours}:${minutesStr} ${period}`;
  })();

  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();
    
    const maxX = (container.width / 2) - button.width;
    const maxY = (container.height / 2) - button.height;
    
    const randomX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * maxX * 0.8 + 20);
    const randomY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * maxY * 0.8 + 20);

    setNoPosition({ x: randomX, y: randomY });
    setYesScale(prev => Math.min(prev + 0.15, 2.5));
    setNoClicks(prev => prev + 1);
  };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, []);

  const slideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden px-4 sm:px-6"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center z-10 max-w-lg text-center w-full"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10 border-8 border-secondary mb-8"
            >
              <img 
                src={dogGif}
                alt="Cute puppy" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary font-medium tracking-tight leading-[1.1] mb-12">
              Will you go on a date with me?
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative w-full h-40 sm:h-24">
              <motion.button
                onClick={() => setStep(2)}
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale + 0.05 }}
                whileTap={{ scale: yesScale - 0.05 }}
                className="bg-primary text-primary-foreground font-sans font-medium px-8 py-4 rounded-full text-xl shadow-xl shadow-primary/20 z-20 cursor-pointer transition-colors hover:bg-primary/90 flex-shrink-0 flex items-center gap-2"
              >
                <Heart className="w-6 h-6 fill-current" /> Yes
              </motion.button>

              <motion.button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                animate={{ 
                  x: noPosition.x, 
                  y: noPosition.y,
                  scale: Math.max(1 - (noClicks * 0.08), 0)
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-secondary text-secondary-foreground font-sans font-medium px-6 py-3 rounded-full text-lg absolute sm:static sm:absolute z-10 hover:bg-secondary/80 flex-shrink-0"
                style={{
                  pointerEvents: noClicks >= 12 ? 'none' : 'auto',
                  opacity: noClicks >= 12 ? 0 : 1,
                  right: 'auto'
                }}
              >
                no...
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center z-10 max-w-lg text-center w-full"
          >
            <Confetti />
            <motion.div 
              initial={{ rotate: -5, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-sm aspect-video rounded-3xl bg-white flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/20 border-8 border-secondary mb-8"
            >
              <img 
                src={ladyTrampGif}
                alt="Lady and the Tramp Congrats" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <h2 className="font-serif text-4xl sm:text-5xl text-primary font-medium mb-4 leading-tight">
                Wait you actually said yes??
              </h2>
              <p className="text-xl text-foreground font-sans mb-10">
                I was so ready for you to say no.
              </p>
              
              <button
                onClick={() => setStep(3)}
                className="bg-primary text-primary-foreground font-sans font-medium px-8 py-4 rounded-full text-xl shadow-xl shadow-primary/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                okay okay! <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center z-10 max-w-lg text-center w-full"
          >
            <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-secondary/50">
              <Calendar className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-primary font-medium mb-10 leading-tight">
              So... when are you free?
            </h2>

            <div className="w-full max-w-xs flex flex-col gap-6 mb-12">
              <div className="flex flex-col gap-2 text-left">
                <label className="text-sm font-medium text-foreground ml-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Pick a Day
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-input/50 border-2 border-border rounded-2xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="text-sm font-medium text-foreground ml-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> What Time?
                </label>
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-input/50 border-2 border-border rounded-2xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!date || !time}
              className="bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none font-sans font-medium px-8 py-4 rounded-full text-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              set the date!
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center z-10 max-w-2xl text-center w-full"
          >
            <h2 className="font-serif text-4xl sm:text-5xl text-primary font-medium mb-10 leading-tight">
              What are we feeling?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mb-10">
              {FOOD_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFood(option.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
                    food === option.id 
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-105' 
                      : 'border-border bg-white hover:border-primary/40 hover:bg-secondary/30'
                  }`}
                >
                  <option.icon className={`w-10 h-10 mb-3 ${food === option.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${food === option.id ? 'text-primary' : 'text-foreground'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="h-16 flex items-center justify-center">
              <AnimatePresence>
                {food && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => {
                      submitProposal(food);
                      setStep(5);
                    }}
                    className="bg-primary text-primary-foreground font-sans font-medium px-10 py-4 rounded-full text-xl shadow-xl shadow-primary/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    let's go <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center z-10 max-w-lg text-center w-full"
          >
            <Confetti />
            <Celebration />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/20 border-8 border-secondary mb-10"
            >
              <img 
                src={cuteDogGif}
                alt="Cute puppy sitting" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <h2 className="font-serif text-3xl sm:text-4xl text-primary font-medium mb-4 leading-relaxed">
                glad you didn't say no. <br/>
                be ready by {formattedTime}, I'm coming to get you <Car className="inline-block w-6 h-6 text-primary ml-1 -translate-y-1" />
              </h2>
              
              <p className="text-sm sm:text-base text-muted-foreground font-sans italic mt-8 max-w-sm">
                P.S. normal people text. I made a website on Replit during lunch. For you. No big deal.
              </p>

              <div className="flex gap-3 mt-8">
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
                <Heart className="w-6 h-6 text-primary/60 fill-primary/40 -translate-y-2" />
                <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[60%] -right-[10%] w-[30vw] h-[30vw] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-[20%] right-[20%] w-[15vw] h-[15vw] rounded-full bg-primary/5 blur-2xl" />
      </div>
    </div>
  );
}
