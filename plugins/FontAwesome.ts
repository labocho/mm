import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPlay);
library.add(faPause);

Vue.component("font-awesome-icon", FontAwesomeIcon);
