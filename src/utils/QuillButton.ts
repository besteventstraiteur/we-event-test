import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class EmailButtonBlot extends BlockEmbed {
  static blotName = "emailButton";
  static tagName = "a";

  static create(value: any) {
    const node = super.create();
    node.setAttribute("href", value.href || "#");
    node.setAttribute("target", "_blank");

    node.style.display = "inline-block";
    node.style.padding = value.padding || "12px 20px";
    node.style.margin = value.margin || "10px 0";
    node.style.backgroundColor = value.bg || "#2563eb";
    node.style.color = value.color || "#ffffff";
    node.style.borderRadius = value.radius || "6px";
    node.style.textDecoration = "none";
    node.style.fontWeight = "600";

    node.innerText = value.text || "Click here";

    return node;
  }

  static value(node: HTMLElement) {
    return {
      href: node.getAttribute("href"),
      text: node.innerText,
    };
  }
}

Quill.register(EmailButtonBlot);
