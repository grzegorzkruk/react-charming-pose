import React, { Component } from "react";
import posed, { PoseGroup } from "react-pose";
import SplitText from "./splitText";

export default class Charming extends Component {
  letterCounter = 0;
  render() {
    return React.Children.map(this.props.children, (children, i) =>
      this.renderSplitLetters(children, i)
    );
  }

  splitText(text) {
    const GroupLetters = posed.span({
      enter: {
        staggerChildren: 50
      }
    });
    const charPoses = {
      initial: this.props.initialStyle,
      enter: this.props.enterStyle
    };

    return this.props.animated ? (
      <GroupLetters initialPose="initial" pose="enter">
        <SplitText
          charPoses={charPoses}
          splitRegex={this.props.splitRegex}
          tagName={this.props.tagName}
        >
          {text}
        </SplitText>
      </GroupLetters>
    ) : (
      text.split(this.props.splitRegex).map(letter => {
        this.letterCounter++;
        const TagName = this.props.tagName;
        const { classPrefix } = this.props;
        return (
          <TagName
            class={`${classPrefix}${this.letterCounter}`}
            aria-hidden="true"
            style={{
              color: this.getRandomColor()
            }}
          >
            {letter}
          </TagName>
        );
      })
    );
  }

  renderSplitLetters(element, i) {
    if (typeof element === "string") {
      return this.splitText(element);
    } else if (typeof element.props.children === "string") {
      const processedElements = this.renderSplitLetters(element.props.children);
      return (
        <element.type
          {...element.props}
          key={Math.floor(Math.random() * 1000 + 1).toString() + i}
          aria-label={element.props.children}
        >
          {processedElements}
        </element.type>
      );
    } else {
      return element;
    }
  }

  getRandomColor() {
    return "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  }
}

Charming.defaultProps = {
  tagName: "span",
  classPrefix: "char",
  splitRegex: " ",
  animated: true,
  randomColorize: true,
  initialStyle: { opacity: 0, y: "-100%" },
  enterStyle: { opacity: 1, y: "0%" }
};

function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}
