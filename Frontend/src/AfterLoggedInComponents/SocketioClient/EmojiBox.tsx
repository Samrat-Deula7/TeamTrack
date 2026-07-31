import { useState } from "react";

type EmojiBoxProp = {
  openEmoji: boolean;
  setOpenEmoji: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectEmoji: React.Dispatch<React.SetStateAction<string>>;
};

const EmojiBox: React.FC<EmojiBoxProp> = ({
  openEmoji,
  setOpenEmoji,
  setSelectEmoji,
}) => {
  const emojiList1 = [
    { emoji: "😀", text: "happy/grinning" },
    { emoji: "😃", text: "joyful" },
    { emoji: "😄", text: "laughing" },
    { emoji: "😁", text: "beaming" },
    { emoji: "😆", text: "laughing hard" },
    { emoji: "😅", text: "nervous laugh" },
    { emoji: "🤣", text: "rolling on floor laughing" },
    { emoji: "😂", text: "tears of joy" },
    { emoji: "🙂", text: "slight smile" },
    { emoji: "🙃", text: "upside down" },
    { emoji: "😉", text: "wink" },
    { emoji: "😊", text: "blushing smile" },
    { emoji: "😇", text: "innocent/angel" },
    { emoji: "🥰", text: "adoring/loved" },
    { emoji: "😍", text: "heart eyes/love" },
    { emoji: "🤩", text: "star struck" },
    { emoji: "😘", text: "kiss" },
    { emoji: "😗", text: "kissing" },
    { emoji: "😚", text: "kissing closed eyes" },
    { emoji: "😙", text: "kissing smiling" },
    { emoji: "🥲", text: "smiling with tear" },
    { emoji: "😋", text: "yummy/tasty" },
    { emoji: "😛", text: "tongue out" },
    { emoji: "😜", text: "winking tongue" },
    { emoji: "🤪", text: "crazy/silly" },
    { emoji: "😝", text: "closed eyes tongue" },
    { emoji: "🤑", text: "money face" },
    { emoji: "🤗", text: "hug" },
    { emoji: "🤭", text: "giggle" },
    { emoji: "🤫", text: "shush" },
    { emoji: "🤔", text: "thinking" },
    { emoji: "🤐", text: "zipped mouth" },
    { emoji: "🤨", text: "suspicious/raised eyebrow" },
    { emoji: "😐", text: "neutral" },
    { emoji: "😑", text: "expressionless" },
    { emoji: "😶", text: "no mouth" },
    { emoji: "😏", text: "smirk" },
    { emoji: "😒", text: "unamused" },
    { emoji: "🙄", text: "eye roll" },
    { emoji: "😬", text: "grimace" },
    { emoji: "🤥", text: "lying" },
    { emoji: "😌", text: "relieved" },
    { emoji: "😔", text: "sad/pensive" },
    { emoji: "😪", text: "sleepy" },
    { emoji: "🤤", text: "drooling" },
    { emoji: "😴", text: "sleeping" },
    { emoji: "😷", text: "sick/mask" },
    { emoji: "🤒", text: "fever" },
    { emoji: "🤕", text: "hurt/bandage" },
    { emoji: "🤢", text: "nauseous" },
    { emoji: "🤮", text: "vomiting" },
    { emoji: "🤧", text: "sneezing" },
    { emoji: "🥵", text: "hot" },
    { emoji: "🥶", text: "cold" },
    { emoji: "🥴", text: "dizzy/woozy" },
    { emoji: "😵", text: "dizzy" },
    { emoji: "🤯", text: "mind blown" },
    { emoji: "🤠", text: "cowboy" },
    { emoji: "🥳", text: "party" },
    { emoji: "😎", text: "cool/sunglasses" },
    { emoji: "🤓", text: "nerd" },
    { emoji: "🧐", text: "monocle/curious" },
    { emoji: "😕", text: "confused" },
    { emoji: "😟", text: "worried" },
    { emoji: "🙁", text: "frowning" },
    { emoji: "😮", text: "surprised/wow" },
    { emoji: "😯", text: "astonished" },
    { emoji: "😲", text: "shocked" },
    { emoji: "😳", text: "flushed/embarrassed" },
    { emoji: "🥺", text: "pleading" },
    { emoji: "😦", text: "frowning open mouth" },
    { emoji: "😧", text: "anguished" },
    { emoji: "😨", text: "fearful" },
    { emoji: "😰", text: "anxious sweat" },
    { emoji: "😥", text: "sad relief" },
    { emoji: "😢", text: "crying" },
    { emoji: "😭", text: "sobbing" },
    { emoji: "😱", text: "screaming/fear" },
    { emoji: "😖", text: "confounded" },
    { emoji: "😣", text: "persevering" },
    { emoji: "😞", text: "disappointed" },
    { emoji: "😓", text: "downcast sweat" },
    { emoji: "😩", text: "weary" },
    { emoji: "😫", text: "tired" },
  ];
  const emojiList2 = [
    { emoji: "🥱", text: "yawning" },
    { emoji: "😤", text: "huffing/triumphant" },
    { emoji: "😡", text: "angry" },
    { emoji: "😠", text: "mad" },
    { emoji: "🤬", text: "cursing" },
    { emoji: "😈", text: "devilish" },
    { emoji: "👿", text: "angry devil" },
    { emoji: "💀", text: "skull/death" },
    { emoji: "☠️", text: "skull crossbones" },
    { emoji: "❤️", text: "love/red heart" },
    { emoji: "🧡", text: "orange heart" },
    { emoji: "💛", text: "yellow heart" },
    { emoji: "💚", text: "green heart" },
    { emoji: "💙", text: "blue heart" },
    { emoji: "💜", text: "purple heart" },
    { emoji: "🖤", text: "black heart" },
    { emoji: "🤍", text: "white heart" },
    { emoji: "🤎", text: "brown heart" },
    { emoji: "💔", text: "broken heart" },
    { emoji: "❣️", text: "heart exclamation" },
    { emoji: "💕", text: "two hearts" },
    { emoji: "💞", text: "revolving hearts" },
    { emoji: "💓", text: "beating heart" },
    { emoji: "💗", text: "growing heart" },
    { emoji: "💖", text: "sparkling heart" },
    { emoji: "💘", text: "cupid heart arrow" },
    { emoji: "💝", text: "heart gift" },
    { emoji: "👍", text: "thumbs up" },
    { emoji: "👎", text: "thumbs down" },
    { emoji: "👏", text: "clapping" },
    { emoji: "🙌", text: "celebration/raised hands" },
    { emoji: "🤝", text: "handshake" },
    { emoji: "🙏", text: "prayer/thanks" },
    { emoji: "✌️", text: "peace" },
    { emoji: "🤞", text: "fingers crossed" },
    { emoji: "👌", text: "ok" },
    { emoji: "🤟", text: "love you gesture" },
    { emoji: "🤘", text: "rock on" },
    { emoji: "👊", text: "fist bump" },
    { emoji: "✊", text: "raised fist" },
    { emoji: "👋", text: "wave/hello" },
    { emoji: "🐶", text: "dog" },
    { emoji: "🐱", text: "cat" },
    { emoji: "🐭", text: "mouse" },
    { emoji: "🐹", text: "hamster" },
    { emoji: "🐰", text: "rabbit" },
    { emoji: "🦊", text: "fox" },
    { emoji: "🐻", text: "bear" },
    { emoji: "🐼", text: "panda" },
    { emoji: "🐨", text: "koala" },
    { emoji: "🦁", text: "lion" },
    { emoji: "🐷", text: "pig" },
    { emoji: "🐸", text: "frog" },
    { emoji: "🐵", text: "monkey" },
    { emoji: "🦄", text: "unicorn" },
    { emoji: "🐝", text: "bee" },
    { emoji: "🍕", text: "pizza" },
    { emoji: "🍔", text: "burger" },
    { emoji: "🍟", text: "fries" },
    { emoji: "🌮", text: "taco" },
    { emoji: "🍩", text: "donut" },
    { emoji: "🍦", text: "ice cream" },
    { emoji: "☕", text: "coffee" },
    { emoji: "🍎", text: "apple" },
    { emoji: "🍇", text: "grapes" },
    { emoji: "🍓", text: "strawberry" },
    { emoji: "☀️", text: "sunny" },
    { emoji: "🌧️", text: "rainy" },
    { emoji: "❄️", text: "snow" },
    { emoji: "🔥", text: "fire" },
    { emoji: "🌈", text: "rainbow" },
    { emoji: "⭐", text: "star" },
    { emoji: "🎉", text: "celebration/party" },
  ];
  //   since there are only two emoji list we can toggle it
  const [showFirst, setShowFirst] = useState(true);
  return (
    <>
      <div
        className={`absolute bottom-15 md:left-13 items-center justify-center w-auto  md:w-130 h-80 md:h-[]  bg-[#101820] backdrop-blur-md shadow-lg rounded-xl border border-white/10 ${openEmoji ? "flex" : "hidden"}`}
      >
        <button
          onClick={() => {
            setOpenEmoji(false);
          }}
          className="absolute top-0 right-2 text-xl lg:text-3xl focus:outline-none cursor-pointer text-white pointer-events-auto"
          aria-label="Close button"
        >
          &times;
        </button>

        <p
          className="absolute top-1 left-3 cursor-pointer "
          onClick={() => setShowFirst(!showFirst)}
        >
          {emojiList1[0].emoji}
        </p>
        <span
          className={`absolute top-7 left-4 w-[15px] h-1 bg-green-500 rounded-full ${showFirst ? "flex" : "hidden"}`}
        ></span>

        <p
          className="absolute top-1 left-10 cursor-pointer"
          onClick={() => setShowFirst(!showFirst)}
        >
          {emojiList2[8].emoji}
        </p>
        <span
          className={`absolute top-7 left-11 w-[15px] h-1 bg-green-500 rounded-full ${showFirst ? "hidden" : "flex"}`}
        ></span>
        <div
          className={`flex h-70 w-70 md:w-130 flex-wrap justify-around items-center p-2 pt-4 ${showFirst ? "flex" : "hidden"}`}
        >
          {emojiList1.map((emoji) => (
            <div
              className={`text-xl md:text-3xl cursor-pointer hover:transform hover:-translate-0.5 hover:duration-200 md:hover:text-[31px] ${showFirst ? "flex" : "hidden"}`}
              onClick={() => setSelectEmoji(emoji.emoji)}
            >
              {emoji.emoji}
            </div>
          ))}
        </div>

        <div
          className={`flex h-70 w-70 md:w-130 flex-wrap justify-around items-center p-2 pt-4 ${showFirst ? "hidden" : "flex"}`}
        >
          {emojiList2.map((emoji) => (
            <div
              className={`text-xl md:text-3xl cursor-pointer hover:transform hover:-translate-0.5 hover:duration-200 md:hover:text-[31px] ${showFirst ? "hidden" : "flex"}`}
              onClick={() => setSelectEmoji(emoji.emoji)}
            >
              {emoji.emoji}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EmojiBox;
