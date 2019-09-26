// import Debug from "~/Debug";
// Debug.print({foo: 1});
export default {
  print(obj: any) {
    const d = document.querySelector("#debug");
    if (d === null) return;

    d.textContent = JSON.stringify(obj);
  }
}
