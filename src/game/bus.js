// Tiny event bus between the Phaser world and the React UI.
// The game never renders paragraphs: it announces what the player is near or
// opening, and React shows the matching panel from content.ts.
//
// Events
//   park:near    detail: { id, name } | null   player entered/left an exhibit
//   park:pause / park:resume                    React panel or map opened / closed
//   park:travel  detail: { id }                 fast travel to an exhibit
//   park:ready                                  scene finished building
//   park:where -> park:here  detail: { x, y }   map asks for the ranger position (px)

const bus = new EventTarget();

export const emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, { detail }));

export const on = (type, handler) => {
  bus.addEventListener(type, handler);
  return () => bus.removeEventListener(type, handler);
};
