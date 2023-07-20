import { addNativeElement, getCurrentPageContext, initAppElement } from "@canva/design";
import {
  Button,
  FormField,
  NumberInput,
  Rows,
  Text,

} from "@canva/app-ui-kit";
import React from "react";
import styles from "styles/components.css";

type AppElementData = {
  numElements: number;
  newTop: number;
  newLeft: number;
};

type UIState = AppElementData;

const initialState: UIState = {
  numElements: 4,
  newTop: 0,
  newLeft: 0,
};

const appElementClient = initAppElement<AppElementData>({
  render: (data) => {
    return [
      {
        type: "TEXT",
        top: 0,
        left: data.newLeft,
        ...data,
        children: ["X"],
      },
    ];
  },
});

export const App = () => {
  const [state, setState] = React.useState<UIState>(initialState);

  const {
    numElements,
  } = state;

  React.useEffect(() => {
    appElementClient.registerOnElementChange((appElement) => {
      setState(appElement ? appElement.data : initialState);
    });
  }, []);

  return (
      <div className={styles.scrollContainer}>
        <Rows spacing="2u">
          <Text>
            This app helps create nice arrangements of elements on your design.
          </Text>
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
          <Button
              variant="primary"
              onClick={async () => {
                const context = await getCurrentPageContext();
                const width = context.dimensions?.width || 1000;
                const height = context.dimensions?.height || 1000;

                const length = 100;

                for (let i = 0; i < state.numElements; i++) {
                  const x = i * width / state.numElements;

                  await addNativeElement({
                    type: "SHAPE",
                    paths: [
                      {
                        d: "M 0 0 H 100 V 100 H 0 L 0 0",
                        fill: {
                          color: "#ff0099",
                        },
                      },
                    ],
                    viewBox: {
                      height: length,
                      width: length,
                      left: 0,
                      top: 0,
                    },
                    left: x + length / 2,
                    top: height / 2 - length / 2,
                    width: 100,
                    height: 100,
                  });
                }
              }}
              stretch
          >
            Add Elements
          </Button>
        </Rows>
      </div>
  );
};