import React, { useRef, useEffect, useState, useCallback } from "react";
import Editor, { OnMount, OnChange } from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setCode, setSuggestion } from "../features/room/roomSlice";
import axios from "axios";
import * as monaco from "monaco-editor";

interface EditorProps {
    onType: () => void;
}

export default function CodeEditor({ onType }: EditorProps) {
    const dispatch = useDispatch();
    const { code, suggestion, isDarkTheme } = useSelector((state: RootState) => state.room);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<any>(null);
    const debounceRef = useRef<number | null>(null);

    const [decorations, setDecorations] = useState<string[]>([]);

    const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
        editorRef.current = editor;
        monacoRef.current = monacoInstance;

        editor.addCommand(monaco.KeyCode.Tab, () => {
            acceptSuggestion(editor);
        });
        editor.addCommand(monaco.KeyCode.Enter, () => {
            acceptSuggestion(editor);
        });

        editor.onDidChangeCursorPosition(() => {
            const position = editor.getPosition();
            if (!position) return;

            const layoutInfo = editor.getDomNode()?.getBoundingClientRect();
            const cursorCoords = editor.getScrolledVisiblePosition(position);

            if (!cursorCoords || !layoutInfo) return;

            setHintPosition({
                top: cursorCoords.top - 25,
                left: cursorCoords.left + 10,
            });
        });
    };

    const acceptSuggestion = (editor: monaco.editor.IStandaloneCodeEditor) => {
        const currentSuggestion = suggestionRef.current;
        if (currentSuggestion) {
            const position = editor.getPosition();
            if (!position) return;

            editor.executeEdits("autocomplete", [{
                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                text: currentSuggestion,
                forceMoveMarkers: true
            }]);

            dispatch(setSuggestion(null));
        } else {
            editor.trigger('keyboard', 'type', { text: '\n' });
        }
    };

    const suggestionRef = useRef(suggestion);
    useEffect(() => {
        suggestionRef.current = suggestion;
        updateGhostText();
    }, [suggestion]);

    const updateGhostText = () => {
        if (!editorRef.current || !monacoRef.current) return;

        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) return;

        const position = editor.getPosition();
        if (suggestion && position) {
            const newDecorations: monaco.editor.IModelDeltaDecoration[] = [{
                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                options: {
                    after: {
                        content: suggestion,
                        inlineClassName: "ghost-text",
                    },
                    showIfCollapsed: true,
                }
            }];
            const ids = editor.deltaDecorations(decorations, newDecorations);
            setDecorations(ids);
        } else {
            const ids = editor.deltaDecorations(decorations, []);
            setDecorations(ids);
        }
    };



    const handleEditorChange: OnChange = (value, event) => {
        if (value === undefined) return;

        dispatch(setCode(value));

        onType();

        if (suggestion) dispatch(setSuggestion(null));

        if (debounceRef.current) window.clearTimeout(debounceRef.current);

        debounceRef.current = window.setTimeout(async () => {
            await fetchAutocomplete(value);
        }, 600);
    };

    const fetchAutocomplete = async (currentCode: string) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/autocomplete`, {
                code: currentCode,
                cursorPosition: currentCode.length,
                language: "python"
            });
            if (res.data.suggestion) {
                dispatch(setSuggestion(res.data.suggestion));
            }
        } catch (err) {
            console.error("Autocomplete failed", err);
        }
    };

    const [hintPosition, setHintPosition] = useState<{ top: number, left: number } | null>(null);

    return (
        <div className="h-full w-full shadow-lg rounded-md overflow-hidden relative border border-gray-600">
            <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                theme={isDarkTheme ? "vs-dark" : "light"}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                    fontLigatures: true,
                    wordWrap: "on",
                    padding: { top: 20, bottom: 20 },
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderWhitespace: "all",
                    contextmenu: true,
                }}
            />


            <style>{`
        .monaco-editor .opacity-50 { opacity: 0.5 !important; }
        .monaco-editor .italic { font-style: italic !important; }
        .ghost-text {
    opacity: 0.5;
    font-style: italic;
    color: #9ca3af;
    transition: opacity 0.3s ease-in-out;
}
      `}</style>
        </div>
    );
}