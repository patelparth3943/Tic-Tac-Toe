import { motion } from "framer-motion";
import Spinner from "./Spinner";
import "./styles.css";

export default function FullPageTextSpinnerLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-custom-bg">
      <motion.div
        className="spinner spinner-1"
        initial={{ rotate: 45 }}
        animate={{ rotate: -315 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <Spinner
          text="LOADING  LOADING  LOADING  LOADING  LOADING"
          radius={800}
          fontSize="180px"
          letterSpacing={8}
        />
      </motion.div>
      <motion.div
        className="spinner spinner-2"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <Spinner
          text="LOADING  LOADING  LOADING  LOADING"
          radius={650}
          fontSize="180px"
          letterSpacing={10}
        />
      </motion.div>
      <motion.div
        className="spinner spinner-3"
        initial={{ rotate: -5 }}
        animate={{ rotate: -365 }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <Spinner
          text="LOADING LOADING LOADING"
          radius={480}
          fontSize="180px"
          letterSpacing={15}
        />
      </motion.div>
      <motion.div
        className="parth-loader"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
      >
      </motion.div>
    </div>
  );
}
