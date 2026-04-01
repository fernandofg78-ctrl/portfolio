import "./styles/Styles.css";
import img0 from "../../assets/images/hangman-1.png";
import img1 from "../../assets/images/hangman-2.png";
import img2 from "../../assets/images/hangman-3.png";
import img3 from "../../assets/images/hangman-4.png";
import img4 from "../../assets/images/hangman-5.png";
import img5 from "../../assets/images/hangman-6.png";
import img6 from "../../assets/images/hangman-7.png";

const robot_img = [img0, img1, img2, img3, img4, img5, img6];

export const HangmanDrawing = ({ numberOfGuesses }) => {
  return (
    <div className="drawing-container">
      {" "}
      {/* <--- Corregido className */}
      <img
        src={robot_img[numberOfGuesses]}
        className="robot-image"
        alt="Ahorcado"
      />
    </div>
  );
};
