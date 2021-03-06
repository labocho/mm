import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown, faChevronUp, faCircle, faPlay, faPause, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faChevronDown);
library.add(faChevronUp);
library.add(faCircle);
library.add(faPlay);
library.add(faPause);
library.add(faRedo);

Vue.component("font-awesome-icon", FontAwesomeIcon);
