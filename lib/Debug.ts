// import Debug from "~/lib/Debug";
// Debug.print({foo: 1});
import url from "url";

const enabled = url.parse(location.href, true).query.debug !== undefined;
export default {
  enabled: enabled,
  print(obj: any) {
    if (!enabled) return;

    const d = document.querySelector("#debug");
    if (d === null) return;

    d.textContent = JSON.stringify(obj);
  }
}
