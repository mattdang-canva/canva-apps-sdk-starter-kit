import { addNativeElement, getCurrentPageContext, initAppElement } from "@canva/design";
import {
  Button,
  FormField,
  NumberInput,
  Rows, Select,
  Text, TextInput,

} from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";

type Arrangement = "horizontal" | "ellipse"

type AppElementData = {
  color: string;
  arrangement: Arrangement;
  numElements: number;
};

type UIState = AppElementData;

const initialState: UIState = {
  color: "#38b6ff",
  arrangement: "horizontal",
  numElements: 5,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [
      {
        type: "TEXT",
        top: 0,
        left: 0,
        ...data,
        children: ["X"],
      },
    ];
  },
});

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);

  const {
    color,
    arrangement,
    numElements,
  } = state;

  React.useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  async function generateHorizontal(width: number, height: number) {
    const length = 100;
    const segmentWidth = width / numElements;

    for (let i = 0; i < state.numElements; i++) {
      const x = i * segmentWidth + segmentWidth / 2 - length / 2;

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
          height: length,
          width: length,
          left: 0,
          top: 0,
        },
        left: x,
        top: height / 2 - length / 2,
        width: 100,
        height: 100,
      });

      // rate limited
      await new Promise(r => setTimeout(r, 400));
    }
  }

  return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>
            This app helps create nice arrangements of elements on your design.
          </Text>
          <FormField
              label="Arrangement"
              value={arrangement}
              control={(props) => (
                  <Select<Arrangement>
                      {...props}
                      options={[
                        { value: "horizontal", label: "Horizontal" },
                        { value: "ellipse", label: "Ellipse" },
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
              label="Number of Elements"
              value={numElements}
              control={(props) => (
                  <NumberInput
                      {...props}
                      min={1}
                      max={15}
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

                await generateHorizontal(width, height);
              }}
              stretch
          >
            Create Elements
          </Button>
        </Rows>
      </div>
  );
};