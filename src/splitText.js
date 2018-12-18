import React, { PureComponent, ReactElement } from "react";
import posed from "react-pose";
import { invariant } from "hey-listen";

const splitStyles = { display: "inline-block" };

// Memoize?
const parseText = (text, splitRegex = " ") => {
  invariant(typeof text === "string", "Child of SplitText must be a string");

  const splitText = text.split(splitRegex).map(word => word.split(""));

  return {
    text,
    numChars: text.length,
    splitText: splitText
  };
};

// Memoize?
const getPoseProps = props => {
  const { wordPoses, charPoses, children, ...poseProps } = props;
  return poseProps;
};

class SplitText extends PureComponent {
  static getDerivedStateFromProps({ children, splitRegex }, state) {
    return !state || children !== state.text
      ? parseText(children, splitRegex)
      : null;
  }

  props;
  Word;
  Char;

  constructor(props) {
    super(props);

    this.state = {};

    const { wordPoses, charPoses, children, tagName } = props;

    parseText(children);

    if (wordPoses) this.Word = posed[tagName](wordPoses);
    if (charPoses) this.Char = posed[tagName](charPoses);
  }

  renderChars(word, wordIndex, numWords, baseCharCount) {
    const { numChars } = this.state;
    const numCharsInWord = word.length;
    const { text } = this.state;

    return word.map((char, i) => {
      return this.Char ? (
        <this.Char
          key={text + i}
          style={splitStyles}
          wordIndex={wordIndex}
          numWords={numWords}
          charIndex={baseCharCount + i}
          charInWordIndex={i}
          numChars={numChars}
          numCharsInWord={numCharsInWord}
          {...getPoseProps(this.props)}
        >
          {char}
        </this.Char>
      ) : (
        char
      );
    });
  }

  renderWords() {
    const { text, splitText } = this.state;
    const numWords = splitText.length;
    let charCount = 0;

    return splitText.map((word, i) => {
      const chars = [
        ...this.renderChars(word, i, numWords, charCount),
        i !== numWords - 1 ? "\u00A0" : null
      ];

      charCount += word.length;

      return this.Word ? (
        <this.Word
          key={text + i}
          style={splitStyles}
          wordIndex={i}
          numWords={numWords}
          {...getPoseProps(this.props)}
        >
          {chars}
        </this.Word>
      ) : (
        <this.props.tagName style={splitStyles} key={text + i}>
          {chars}
        </this.props.tagName>
      );
    });
  }

  render() {
    return this.renderWords();
  }
}

SplitText.defaultProps = {
  splitRegex: " ",
  tagName: "span"
};

export default SplitText;
