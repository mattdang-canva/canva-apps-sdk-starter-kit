import { addNativeElement, getCurrentPageContext, initAppElement } from "@canva/design";
import {
  Button,
  FormField,
  NumberInput, RadioGroup,
  Rows, Select,
  Text, TextInput,

} from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";

const drawIntervalMs = 400;

type Arrangement = "horizontal" | "circle" | "wave"

type AppElementData = {
  color: string;
  arrangement: Arrangement;
  elementWidth: number;
  numElements: number;
  useRotation: boolean;
};

type UIState = AppElementData;

const initialState: UIState = {
  color: "#38b6ff",
  arrangement: "wave",
  elementWidth: 100,
  numElements: 5,
  useRotation: true,
};

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);

  const {
    color,
    arrangement,
    elementWidth,
    numElements,
    useRotation,
  } = state;

  async function generateHorizontal(width: number, height: number) {
    const segmentWidth = width / numElements;

    for (let i = 0; i < state.numElements; i++) {
      const x = i * segmentWidth + segmentWidth / 2 - elementWidth / 2;

      await addNativeElement({
        type: "SHAPE",
        paths: [
          {
            d: "M 0 0 H 100 V 100 H 0 L 0 0",
            fill: {
              color: state.color,
            },
          },
        ],
        viewBox: {
          height: elementWidth,
          width: elementWidth,
          left: 0,
          top: 0,
        },
        left: x,
        top: height / 2 - elementWidth / 2,
        width: elementWidth,
        height: elementWidth,
      });

      // rate limited
      await new Promise(r => setTimeout(r, drawIntervalMs));
    }
  }

  async function generateCircle(width: number, height: number) {
    const tSegment = 2 * Math.PI / state.numElements;
    const tStart = - 2 * Math.PI / 4 + tSegment / 2;

    const r = height / 3;

    for (let i = 0; i < state.numElements; i++) {
      const t = tStart + i * tSegment;

      const x = width / 2 + r * Math.cos(t) - elementWidth / 2;
      const y = height / 2 + r * Math.sin(t) - elementWidth / 2;

      const rotationDegrees = -360 + t * 180 / Math.PI;

      await addNativeElement({
        type: "SHAPE",
        paths: [
          {
            d: "M 0 0 H 100 V 100 H 0 L 0 0",
            fill: {
              color: state.color,
            },
          },
        ],
        viewBox: {
          height: elementWidth,
          width: elementWidth,
          left: 0,
          top: 0,
        },
        left: x,
        top: y,
        width: elementWidth,
        height: elementWidth,
        rotation: useRotation ? rotationDegrees : undefined,
      });

      // rate limited
      await new Promise(r => setTimeout(r, drawIntervalMs));
    }
  }

  async function generateWave(width: number, height: number) {
    const segmentWidth = width / numElements;
    const tSegment = 2 * Math.PI / state.numElements;

    for (let i = 0; i < state.numElements; i++) {
      const x = i * segmentWidth + segmentWidth / 2 - elementWidth / 2;
      const y = height / 2 + height / 4 * Math.cos(i * tSegment) - elementWidth / 2;

      await addNativeElement({
        type: "SHAPE",
        paths: [
          {
            d: "M 0 0 H 100 V 100 H 0 L 0 0",
            fill: {
              color: state.color,
            },
          },
        ],
        viewBox: {
          height: elementWidth,
          width: elementWidth,
          left: 0,
          top: 0,
        },
        left: x,
        top: y,
        width: elementWidth,
        height: elementWidth,
      });

      // rate limited
      await new Promise(r => setTimeout(r, drawIntervalMs));
    }
  }

  return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>
            This app helps create 𝔞𝔢𝔰𝔱𝔥𝔢𝔱𝔦𝔠 𝔞𝔯𝔯𝔞𝔫𝔤𝔢𝔪𝔢𝔫𝔱𝔰 of elements on your design.
          </Text>
          <FormField
              label="Arrangement"
              value={arrangement}
              control={(props) => (
                  <Select<Arrangement>
                      {...props}
                      options={[
                        { value: "horizontal", label: "Horizontal" },
                        { value: "circle", label: "Circle" },
                        { value: "wave", label: "Wave" },
                      ]}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            arrangement: value,
                          };
                        });
                      }}
                      stretch
                  />
              )}
          />
          <FormField
              label="Element Width"
              value={elementWidth}
              control={(props) => (
                  <NumberInput
                      {...props}
                      min={10}
                      max={200}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            elementWidth: Number(value || 10),
                          };
                        });
                      }}
                  />
              )}
          />
          <FormField
              label="Number of Elements"
              value={numElements}
              control={(props) => (
                  <NumberInput
                      {...props}
                      min={1}
                      max={64}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            numElements: Number(value || 1),
                          };
                        });
                      }}
                  />
              )}
          />
          { arrangement == "circle" ? <FormField
              label="Rotate Items?"
              value={useRotation}
              control={(props) => (
                  <RadioGroup
                      {...props}
                      options={[
                        {
                          label: "Yes",
                          value: true,
                        },
                        {
                          label: "No",
                          value: false,
                        },
                      ]}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            useRotation: value,
                          };
                        });
                      }}
                  />
              )}
          /> : undefined }
          <FormField
              label="Color"
              value={color}
              control={(props) => (
                  <TextInput
                      {...props}
                      onChange={(value) => {
                        setState((prevState) => {
                          return {
                            ...prevState,
                            color: value,
                          };
                        });
                      }}
                  />
              )}
          />
          <Button
              variant="primary"
              onClick={async () => {
                const context = await getCurrentPageContext();
                const width = context.dimensions?.width || 1000;
                const height = context.dimensions?.height || 1000;

                switch (state.arrangement) {
                  case "horizontal":
                    await generateHorizontal(width, height);
                    break;
                  case "circle":
                    await generateCircle(width, height);
                    break;
                  case "wave":
                    await generateWave(width, height);
                    break;
                }
              }}
              stretch
          >
            Create Elements
          </Button>
        </Rows>
      </div>
  );
};