import { CodeBlock } from "@/components/code-block";
import { Zap } from "lucide-react";
import { MethodCard } from "@/components/method-card";

export const metadata = {
  title: "Methods - Timepicker-UI",
};

const methods = [
  {
    name: "create()",
    description:
      "Initialize the timepicker. Must be called before using other methods.",
    code: `const picker = new TimepickerUI(input);
picker.create();`,
  },
  {
    name: "open(callback?)",
    description: "Open the timepicker modal programmatically.",
    code: `picker.open();

picker.open(() => {
  console.log('Picker opened');
});`,
  },
  {
    name: "close(updateInput?, callback?)",
    description: "Close the timepicker modal.",
    code: `picker.close();

picker.close(true)(() => {
  console.log('Picker closed with update');
});`,
  },
  {
    name: "getValue()",
    description: "Get current selected time value.",
    code: `const value = picker.getValue();

{
  hour: '10',
  minutes: '30',
  type: 'AM',
  time: '10:30 AM'
}`,
  },
  {
    name: "setValue(time, updateInput?)",
    description: "Set time value programmatically.",
    code: `picker.setValue('10:30 AM');

picker.setValue('15:45', false);`,
  },
  {
    name: "update(options, callback?)",
    description: "Update picker options dynamically.",
    code: `picker.update({
  options: {
    ui: {
      theme: 'dark'
    },
    clock: {
      type: '24h'
    }
  },
  create: true
}, () => {
  console.log('Updated');
});`,
  },
  {
    name: "destroy(options?)",
    description: "Destroy the picker instance and clean up.",
    code: `picker.destroy();

picker.destroy({
  keepInputValue: true,
  callback: () => console.log('Destroyed')
});`,
  },
  {
    name: "getElement()",
    description: "Get the root wrapper element.",
    code: `const wrapper = picker.getElement();`,
  },
];

const staticMethods = [
  {
    name: "TimepickerUI.getById(id)",
    code: `const picker = new TimepickerUI(input, { id: 'my-picker' });
picker.create();

const instance = TimepickerUI.getById('my-picker');`,
  },
  {
    name: "TimepickerUI.getAllInstances()",
    code: `const allPickers = TimepickerUI.getAllInstances();
console.log(allPickers.length);`,
  },
  {
    name: "TimepickerUI.destroyAll()",
    code: `TimepickerUI.destroyAll();`,
  },
  {
    name: "TimepickerUI.isAvailable(selector)",
    code: `if (TimepickerUI.isAvailable('#timepicker')) {
  console.log('Element exists in DOM');
}`,
  },
];

export default function MethodsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Methods</h1>
        <p className="text-lg text-muted-foreground">
          Available methods on TimepickerUI instance
        </p>
      </div>

      <div className="space-y-8 mb-16">
        {methods.map((method) => (
          <MethodCard key={method.name} {...method} />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Static Methods</h2>
        </div>
        <div className="space-y-6">
          {staticMethods.map((method) => (
            <div
              key={method.name}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                <code className="text-primary">{method.name}</code>
              </h3>
              <CodeBlock code={method.code} language="typescript" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
