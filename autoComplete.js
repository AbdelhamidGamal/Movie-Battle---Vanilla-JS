function createAutoDropDown({
  parentDiv,
  onInput,
  renderItem,
  inputValue,
  onSelect
}) {
  const root = document.createElement("div");
  root.classList.add("search");
  root.innerHTML = `
    <input />
    <div class='suggestions'></div>
  `;

  parentDiv.append(root);

  const inputElm = root.querySelector("input");
  const suggestionsElm = root.querySelector(".suggestions");

  inputElm.addEventListener(
    "input",
    debounce(async e => {
      const items = await onInput(e.target.value);
      suggestionsElm.style.display = "block";

      for (let item of items) {
        const div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.innerHTML = renderItem(item);
        suggestionsElm.append(div);

        div.addEventListener("click", () => {
          inputElm.value = inputValue(item);
          suggestionsElm.innerHTML = "";
          suggestionsElm.style.display = "none";

          onSelect(item);
        });
      }
    })
  );
}
