type this;

[@bs.val] external this: this = "";
[@bs.set_index] external setField: (this, string, 'value) => unit = "";
[@bs.get_index] external field: (this, string) => 'value = "";

type prototype;
[@bs.get] external prototype: 'a => prototype = "";
[@bs.set_index] external set: ('a, string, 'b) => unit = "";

let extend(~ctor, ~super, getters) = {
  super |> prototype |> set(ctor, "prototype");
  getters |> List.iter(((name, get)) =>
    set(prototype(ctor), name, get));
};