import React, { useEffect, useState } from 'react';
import { Step } from '../../../api';
import JsonView from '@uiw/react-json-view';
import { Button } from '../../common/button';
import { Switch, SwitchField } from '../../common/switch';
import { Label } from '../../common/fieldset';
import { classNames } from '../../../utils/tailwind';
import { ChevronDownIcon, ChevronUpIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

const StateButton = (props: { label: string; selected: boolean; setSelected: () => void }) => {
  const color = props.selected ? 'zinc' : 'light';
  return (
    <Button className="w-min cursor-pointer" color={color} onClick={props.setSelected}>
      {props.label}
    </Button>
  );
};

export const ErrorView = (props: { error: string }) => {
  return (
    <>
      <pre className="text-dwred rounded-sm p-2  text-wrap text-xs">{props.error}</pre>
    </>
  );
};
/**
 * Section header that allows for exapnsion/contraction of all subcomponents
 */
const SectionHeaderWithExpand = (props: {
  name: string;
  defaultExpanded?: boolean;
  setDefaultExpanded?: (expanded: boolean) => void;
  enableExpansion: boolean;
}) => {
  const MinimizeMaximizeIcon = props.defaultExpanded ? MinusIcon : PlusIcon;
  return (
    <div className="flex flex-row items-center gap-1">
      <h1 className="text-2xl text-gray-900 font-semibold">{props.name}</h1>
      {props.enableExpansion && (
        <MinimizeMaximizeIcon
          className={classNames(
            'text-gray-500',
            'h-5 w-5 rounded-md hover:cursor-pointer hover:scale-105'
          )}
          aria-hidden="true"
          onClick={() => {
            if (props.setDefaultExpanded) {
              props.setDefaultExpanded(!props.defaultExpanded);
            }
          }}
        />
      )}
    </div>
  );
};
export const DataView = (props: { currentStep: Step | undefined; priorStep: Step | undefined }) => {
  const [whichState, setWhichState] = useState<'after' | 'before'>('after');
  const stepToExamine = whichState === 'after' ? props.currentStep : props.priorStep;
  const stateData = stepToExamine?.step_end_log?.state;
  const resultData = stepToExamine?.step_end_log?.result || undefined;
  const inputs = stepToExamine?.step_start_log?.inputs;
  const error = props.currentStep?.step_end_log?.exception;
  const [viewRawData, setViewRawData] = useState<'raw' | 'render'>('render');

  const [allStateExpanded, setAllStateExpanded] = useState(true);
  const [allResultExpanded, setAllResultExpanded] = useState(true);
  const [allInputExpanded, setAllInputExpanded] = useState(true);

  return (
    <div className="pl-1 flex flex-col gap-2 hide-scrollbar">
      <div className="flex flex-row justify-between sticky top-0 z-20 bg-white">
        {/* <h1 className="text-2xl text-gray-900 font-semibold pt-2">State</h1> */}
        <SectionHeaderWithExpand
          name="State"
          defaultExpanded={allStateExpanded}
          setDefaultExpanded={setAllStateExpanded}
          enableExpansion={viewRawData === 'render'}
        />
        <div className="flex flex-row justify-end gap-2 pr-2">
          <SwitchField>
            <Switch
              name="test"
              checked={viewRawData === 'raw'}
              onChange={(checked) => {
                setViewRawData(checked ? 'raw' : 'render');
              }}
            ></Switch>
            <Label className="-mx-2">Raw</Label>
          </SwitchField>

          {stateData !== undefined && (
            <StateButton
              label="after"
              selected={whichState === 'after'}
              setSelected={() => {
                setWhichState('after');
              }}
            />
          )}

          {
            <StateButton
              label="before"
              selected={whichState === 'before'}
              setSelected={() => {
                setWhichState('before');
              }}
            />
          }
        </div>
      </div>

      <StateView stateData={stateData} viewRawData={viewRawData} isExpanded={allStateExpanded} />
      {error && (
        <>
          <h1 className="text-2xl text-gray-900 font-semibold">Error</h1>
          <ErrorView error={error} />
        </>
      )}
      {resultData && Object.keys(resultData).length > 0 && (
        <>
          <SectionHeaderWithExpand
            name="Result"
            defaultExpanded={allResultExpanded}
            setDefaultExpanded={setAllResultExpanded}
            enableExpansion={viewRawData === 'render'}
          />
          <ResultView
            resultData={resultData}
            viewRawData={viewRawData}
            isExpanded={allResultExpanded}
          />
        </>
      )}
      {inputs && Object.keys(inputs).length > 0 && (
        <>
          <SectionHeaderWithExpand
            name="Inputs"
            defaultExpanded={allInputExpanded}
            setDefaultExpanded={setAllInputExpanded}
            enableExpansion={viewRawData === 'render'}
          />
          <InputsView inputs={inputs} isExpanded={allInputExpanded} viewRawData={viewRawData} />
          {/* <FormRenderer data={inputs as DataType} isDefaultExpanded={allInputExpanded} /> */}
        </>
      )}
    </div>
  );
};

export const StateView = (props: {
  stateData: DataType | undefined;
  viewRawData: 'render' | 'raw';
  isExpanded: boolean;
}) => {
  const { stateData, viewRawData, isExpanded } = props;
  return (
    <>
      {stateData !== undefined && viewRawData === 'render' && (
        <FormRenderer data={stateData} isDefaultExpanded={isExpanded} />
      )}
      {stateData !== undefined && viewRawData === 'raw' && (
        <JsonView value={stateData} collapsed={2} enableClipboard={false} />
      )}
    </>
  );
};

export const ResultView = (props: {
  resultData: DataType | undefined;
  viewRawData: 'render' | 'raw';
  isExpanded: boolean;
}) => {
  const { resultData, viewRawData, isExpanded } = props;
  return (
    <>
      {resultData && viewRawData === 'render' && (
        <>
          <FormRenderer data={resultData} isDefaultExpanded={isExpanded} />
        </>
      )}
      {resultData && viewRawData === 'raw' && (
        <>
          <JsonView value={resultData} collapsed={2} enableClipboard={false} />
        </>
      )}
    </>
  );
};

export const InputsView = (props: {
  inputs: object;
  isExpanded: boolean;
  viewRawData: 'render' | 'raw';
}) => {
  const { inputs, viewRawData, isExpanded } = props;
  return (
    <>
      {inputs && viewRawData === 'render' ? (
        <>
          <FormRenderer data={inputs as DataType} isDefaultExpanded={isExpanded} />
        </>
      ) : (
        (inputs && viewRawData) === 'raw' && (
          <>
            <JsonView value={inputs} collapsed={2} enableClipboard={false} />
          </>
        )
      )}
    </>
  );
};

type DataType = Record<string, string | number | boolean | object>;

const Header = (props: {
  name: string;
  isExpanded: boolean;
  setExpanded: (expanded: boolean) => void;
}) => {
  const MinimizeMaximizeIcon = props.isExpanded ? ChevronUpIcon : ChevronDownIcon;

  return (
    <div className="flex flex-row gap-1 z-10 pb-2 items-center">
      <h1 className="text-lg text-gray-900 font-semibold text-under">{props.name}</h1>
      <MinimizeMaximizeIcon
        className={classNames(
          'text-gray-500',
          'h-6 w-6 hover:bg-gray-50 rounded-md hover:cursor-pointer hover:scale-105'
        )}
        aria-hidden="true"
        onClick={() => {
          props.setExpanded(!props.isExpanded);
        }}
      />
    </div>
  );
};
const RenderedField = (props: {
  value: string | number | boolean | object;
  keyName: string;
  level: number;
  defaultExpanded: boolean;
}) => {
  const [isExpanded, setExpanded] = useState(true);
  useEffect(() => {
    setExpanded(props.defaultExpanded);
  }, [props.defaultExpanded, props.value, props.keyName]);
  // TODO: have max level depth.
  const { value, keyName: key, level } = props;
  const bodyClassNames =
    'border-gray-100 border-l-[8px] pl-1 hover:bg-gray-100 text-sm text-gray-700';
  if (key.startsWith('__')) {
    return null;
  }
  return (
    <>
      <Header name={key} isExpanded={isExpanded} setExpanded={setExpanded} />
      {isExpanded &&
        (props.value instanceof Array &&
        props.value.length > 0 &&
        typeof props.value[0] === 'number' ? (
          <div key={key + '-' + String(level)}>
            <JsonView value={props.value} enableClipboard={false} collapsed={1} />
          </div>
        ) : typeof value === 'string' ? (
          <div key={key + '-' + String(level)}>
            <pre
              className={bodyClassNames}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '1000px' }}
            >
              {value}
            </pre>
          </div>
        ) : Array.isArray(value) ? (
          <div key={key + String(level)}>
            <div>
              {value.map((v, i) => {
                return (
                  <div key={key + '-' + i.toString()} className={bodyClassNames}>
                    <RenderedField
                      value={v}
                      keyName={key + '[' + i.toString() + ']'}
                      level={level + 1}
                      defaultExpanded={props.defaultExpanded}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : typeof value === 'object' ? (
          <div key={key}>
            <div>
              {value === null ? (
                <span>NULL</span>
              ) : (
                Object.entries(value).map(([k, v]) => {
                  // if (v instanceof Array && v.length > 0 && typeof v[0] === 'number') {
                  //   // we want to display arrays of numbers as a single string.
                  //   v = v.toString();
                  // }
                  return (
                    <div key={key + '-' + k} className={bodyClassNames}>
                      <RenderedField
                        value={v}
                        keyName={k}
                        level={level + 1}
                        defaultExpanded={props.defaultExpanded}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : value === null ? (
          <div key={key + '-' + String(level)}>
            <pre className={bodyClassNames}>NULL</pre>
          </div>
        ) : (
          <div key={key + '-' + String(level)} className="">
            <pre>{value.toString()}</pre>
          </div>
        ))}
    </>
  );
};

interface FormRendererProps {
  data: Record<string, string | number | boolean | object>;
  isDefaultExpanded: boolean;
}

// This component is used to render the form data in a structured way
const FormRenderer: React.FC<FormRendererProps> = ({ data, isDefaultExpanded: isExpanded }) => {
  if (data !== null) {
    return (
      <>
        {Object.entries(data).map(([key, value]) => {
          return (
            <RenderedField
              keyName={key}
              value={value}
              level={0}
              key={key}
              defaultExpanded={isExpanded}
            />
          );
        })}
      </>
    );
  }
  return null;
};

export default FormRenderer;
