import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";

export default {
  name: "wizards-dropdown-button",
  initialize() {
    withPluginApi("0.8.41", (api) => {
      api.decorateWidget("header-buttons:before", (helper) => {

        let menu_links_buffer = [],
          menu_links = settings.dropdown_items.split("|");

        if (menu_links !== null) {
          if (menu_links.length > 0) {
            menu_links.forEach((link) => {
              const attributes = link.split(",");
              menu_links_buffer.push(
                h(
                  "a.btn.btn-default.btn-icon-text",
                  {
                    href: attributes[2],
                    title: attributes[1],
                  },
                  [
                    iconNode(attributes[0]),
                    [h("span.d-button-label", `${attributes[1]}`)],
                  ]
                )
              );
            });
          }
        }

        //Add class toggle used in mobile.scss; desktop uses hover
        const toggleDropdown = function () {
          const dropdownContent = document.getElementById(
            "dropdown-button-content"
          );
          dropdownContent.classList.toggle("show-dropdown");
        };

        let menu_buffer = [
          h(
            "button.btn.btn-primary.btn-small.btn-icon-text",
            { onclick: toggleDropdown },
            [
              iconNode(settings.button_icon),
              [h("span.d-button-label", `${settings.button_title}`)],
            ]
          ),
        ];

        menu_buffer.push(h("div#dropdown-button-content", menu_links_buffer));

        return h("div#dropdown-button", menu_buffer);
      });
    });
  },
};
