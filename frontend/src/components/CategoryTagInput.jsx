import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useGetCategories from "../hooks/category/useGetCategories.js";

const BRAND_COLORS = ["#00FF7B", "#FF00EE", "#00F2FF", "#EAFF00"];

export const getCategoryColor = (name) => {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return BRAND_COLORS[hash % BRAND_COLORS.length];
};

const MAX = 5;

const CategoryTagInput = ({ selected = [], onChange }) => {
  const [allCategories, setAllCategories] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { getCategories } = useGetCategories();

  useEffect(() => {
    getCategories().then((data) => setAllCategories(data || []));
  }, []);

  // Suggestions: categories matching input, not already selected
  const suggestions = inputVal.trim()
    ? allCategories.filter(
        (c) =>
          c.name.toLowerCase().includes(inputVal.trim().toLowerCase()) &&
          !selected.includes(c.name)
      )
    : [];

  // Whether typed text is an exact match to an existing category (case-insensitive)
  const exactMatch = allCategories.find(
    (c) => c.name.toLowerCase() === inputVal.trim().toLowerCase()
  );

  // Show "Add '...'" only when no exact match and input is non-empty
  const showCreate =
    inputVal.trim().length > 0 &&
    !exactMatch &&
    !selected.includes(inputVal.trim());

  const totalDropdownItems = suggestions.length + (showCreate ? 1 : 0);

  const addTag = (name) => {
    if (selected.length >= MAX) {
      toast.error("MAX 5 CATEGORIES");
      return;
    }
    if (!selected.includes(name)) {
      onChange([...selected, name]);
    }
    setInputVal("");
    setOpen(false);
    setHighlightIdx(-1);
    inputRef.current?.focus();
  };

  const removeTag = (name) => {
    onChange(selected.filter((c) => c !== name));
  };

  const handleCreateNew = async (rawName) => {
    const name = rawName.trim();
    if (!name) return;

    setCreating(true);
    try {
      const res = await fetch("/api/category/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "FAILED TO ADD CATEGORY");
        return;
      }

      const data = await res.json();

      // Add to local list if not already present
      setAllCategories((prev) => {
        const exists = prev.find((c) => c._id === data._id);
        return exists ? prev : [...prev, data];
      });

      addTag(data.name);
    } catch {
      toast.error("FAILED TO ADD CATEGORY");
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, totalDropdownItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!inputVal.trim()) return;

      if (highlightIdx >= 0 && highlightIdx < suggestions.length) {
        // Highlighted suggestion
        addTag(suggestions[highlightIdx].name);
      } else if (highlightIdx === suggestions.length && showCreate) {
        // Highlighted "add new"
        await handleCreateNew(inputVal.trim());
      } else if (exactMatch) {
        addTag(exactMatch.name);
      } else if (suggestions.length > 0) {
        addTag(suggestions[0].name);
      } else {
        await handleCreateNew(inputVal.trim());
      }
    } else if (e.key === "Backspace" && !inputVal && selected.length > 0) {
      removeTag(selected[selected.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightIdx(-1);
    }
  };

  const labelStyle = {
    fontSize: "0.8rem",
    color: "#EAFF00",
    letterSpacing: "0.12em",
    fontFamily: "monospace",
    fontWeight: "bold",
  };

  const inputStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: "0.875rem",
    flex: 1,
    minWidth: "120px",
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span style={labelStyle}>CATEGORIES</span>
        <span
          className="font-mono text-xs"
          style={{
            color: selected.length >= MAX ? "#FF00EE" : "rgba(255,255,255,0.3)",
          }}
        >
          {selected.length}/{MAX}
        </span>
      </div>

      {/* Tag input box */}
      <div
        className="flex flex-wrap gap-1.5 rounded-2xl px-3 py-2.5 cursor-text"
        style={{
          border: open
            ? "1px solid rgba(0,242,255,0.6)"
            : "1px solid rgba(0,242,255,0.3)",
          background: "transparent",
          minHeight: "44px",
          transition: "border-color 0.15s",
          boxShadow: open ? "0 0 10px rgba(0,242,255,0.08)" : "none",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected tags */}
        {selected.map((name) => {
          const color = getCategoryColor(name);
          return (
            <span
              key={name}
              className="flex items-center gap-1 font-mono rounded-full px-2.5 py-0.5"
              style={{
                fontSize: "0.72rem",
                border: `1px solid ${color}`,
                color,
                background: `${color}12`,
                boxShadow: `0 0 6px ${color}33`,
                flexShrink: 0,
              }}
            >
              {name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(name);
                }}
                className="cursor-pointer leading-none"
                style={{
                  color,
                  opacity: 0.7,
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "0.9rem",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        {/* Text input */}
        {selected.length < MAX && (
          <input
            ref={inputRef}
            type="text"
            maxLength={30}
            value={creating ? "Adding..." : inputVal}
            disabled={creating}
            onChange={(e) => {
              setInputVal(e.target.value);
              setOpen(true);
              setHighlightIdx(-1);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // Delay so dropdown click fires first
              setTimeout(() => {
                setOpen(false);
                setHighlightIdx(-1);
              }, 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? "Search or type to add..." : ""}
            style={inputStyle}
          />
        )}
      </div>

      {/* Dropdown */}
      {open && (suggestions.length > 0 || showCreate) && (
        <div
          ref={dropdownRef}
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid rgba(0,242,255,0.25)",
            background: "#000",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 12px rgba(0,242,255,0.06)",
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((cat, idx) => {
            const color = getCategoryColor(cat.name);
            const isHighlighted = idx === highlightIdx;
            return (
              <div
                key={cat._id}
                onMouseDown={() => addTag(cat.name)}
                onMouseEnter={() => setHighlightIdx(idx)}
                className="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-100 font-mono text-sm"
                style={{
                  background: isHighlighted
                    ? "rgba(0,242,255,0.06)"
                    : "transparent",
                  color: isHighlighted ? "#fff" : "rgba(255,255,255,0.6)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span
                  className="rounded-full"
                  style={{
                    width: "6px",
                    height: "6px",
                    background: color,
                    flexShrink: 0,
                    boxShadow: `0 0 4px ${color}`,
                  }}
                />
                {cat.name}
              </div>
            );
          })}

          {showCreate && (
            <div
              onMouseDown={() => handleCreateNew(inputVal.trim())}
              onMouseEnter={() => setHighlightIdx(suggestions.length)}
              className="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors duration-100 font-mono text-sm"
              style={{
                background:
                  highlightIdx === suggestions.length
                    ? "rgba(0,255,123,0.06)"
                    : "transparent",
                color:
                  highlightIdx === suggestions.length
                    ? "#00FF7B"
                    : "rgba(0,255,123,0.55)",
                borderTop: suggestions.length > 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <span style={{ fontSize: "0.85rem" }}>+</span>
              Add &ldquo;{inputVal.trim()}&rdquo; as new category
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      <p
        className="font-mono"
        style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}
      >
        Press Enter to confirm · Backspace to remove last
      </p>
    </div>
  );
};

export default CategoryTagInput;
