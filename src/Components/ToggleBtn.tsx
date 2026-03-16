import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";

type props = {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  icons: React.ReactNode[] | undefined;
};

export default function ToggleBtn(props: props) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={props.value}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onValueChange={(value: any) => {
        if (value) props.onValueChange(value);
      }}
    >
      {props.icons
        ? props.icons.map((icon, index) => {
            return (
              <ToggleGroupItem key={index} className="flex-1" value={props.options[index]}>
                {icon}
              </ToggleGroupItem>
            );
          })
        : props.options.map((option, index) => {
            return (
              <ToggleGroupItem key={index} className="flex-1" value={option}>
                {option}
              </ToggleGroupItem>
            );
          })}
      {/* <ToggleGroupItem className="flex-1" value="left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem className="flex-1" value="center">
        Center
      </ToggleGroupItem>
      <ToggleGroupItem className="flex-1" value="right">
        Right
      </ToggleGroupItem> */}
    </ToggleGroup>
  );
}
