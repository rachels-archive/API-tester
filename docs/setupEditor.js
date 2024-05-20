import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { json } from "@codemirror/lang-json";

export default function setupEditors() {
  const jsonRequestBody = document.querySelector("[data-json-request-body]");
  const jsonResponseBody = document.querySelector("[data-json-response-body]");
  let language = new Compartment(),
    tabSize = new Compartment();

  const basicExtensions = [
    basicSetup,
    // keymap.of(de),
    language.of(json()),
    tabSize.of(EditorState.tabSize.of(2)),
  ];

  const requestEditor = new EditorView({
    state: EditorState.create({
      doc: "{\n\t\n}",
      extensions: basicExtensions,
    }),
    parent: jsonRequestBody,
  });

  const responseEditor = new EditorView({
    state: EditorState.create({
      doc: "{}",
      extensions: [...basicExtensions, EditorView.editable.of(false)],
    }),
    parent: jsonResponseBody,
  });

  function updateResponseEditor(value) {
    responseEditor.dispatch({
      changes: {
        from: 0,
        to: responseEditor.state.doc.length,
        insert: JSON.stringify(value, null, 2),
      },
    });
  }

  return { requestEditor, updateResponseEditor };
}
