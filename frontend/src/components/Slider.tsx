interface Props {
  value: number;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
function Slider({ value, onChangeHandler }: Props) {
  return (
    <div className="w-fit px-10 py-5 flex flex-col items-center shadow-md rounded-lg my-10">
      <h3 className="my-2">Blender</h3>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={onChangeHandler}
        className="bg-black slider my-2"
      />
      <p className="py-2 text-sm">Weight : {value}</p>
    </div>
  );
}

export default Slider;
