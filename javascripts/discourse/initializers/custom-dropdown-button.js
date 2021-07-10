import {withPluginApi} from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";
import { default as composerModal } from "discourse/models/composer";

export default {
  name: "custom-dropdown-button",
  initialize () {
    withPluginApi ("0.8.41", (api) => {
      api.decorateWidget("header-buttons:after", helper => {

        if (api.getCurrentUser() == null) return;

        let container = api.container,
            composerController = container.lookup("controller:composer");

        const createTopic = function() {
          const controller = container.lookup("controller:navigation/category"),
                category = controller.get("category.id"),
                topicCategory = container
                  .lookup("route:topic")
                  .get("context.category.id"),
                categoryd = topicCategory ? topicCategory : category;
            
          composerController.open({
            action: composerModal.CREATE_TOPIC,
            //don't use current category in composer, because we open from a global level
            //categoryId: categoryd,
            draftKey: composerModal.DRAFT
          });
        };
            
        let menu_links_buffer = [],
            menu_links  = settings.dropdown_items.split('|');

        if (menu_links !== null) {
          if (menu_links.length > 0) {
            menu_links.forEach(link => {
              const attributes = link.split(',');
              menu_links_buffer.push (
                h("a.btn.btn-default.btn-icon-text", {
                  href: attributes[2],
                  title: attributes[1]
                  }, 
                  [iconNode(attributes[0]),
                  [h("span.d-button-label",`${attributes[1]}`)]
                  ]
                )
              )
            })
          }
        };

        menu_links_buffer.push (
          h("a.btn.btn-default.btn-icon-text", { onclick: createTopic }, 
            [iconNode(settings.new_topic_icon), 
            [h("span.d-button-label",`${settings.new_topic_title}`)]
            ]
          )
        );
            
        let menu_buffer = [h('button.widget-button.btn.btn-primary.btn-small.btn-icon-text', [iconNode(settings.button_icon),
            [h('span.d-button-label',`${settings.button_title}`)]]
          )];

        menu_buffer.push(h('div.dropdown-content', menu_links_buffer));

        return h('div.dropdown-button', menu_buffer)
      })
    })
  }
}