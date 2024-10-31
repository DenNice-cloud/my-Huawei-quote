<template>
  <div
    v-if="error"
    class="error-message"
  >
    {{ error }}
  </div>

  <div
    v-else
    class="app"
  >
    <div class="history">
      <h2>History</h2>

      <div class="history__list">
        <div
          v-for="(historyValue, index) in historyList.reverse()"
          :key="index"
          class="history__item"
        >
          <div>{{ `${historyList.length - index} - ${historyValue.quote}` }}</div>
          <div>— {{ historyValue.author }}</div>
          <button
            @click="copyToClipboard(historyValue)"
            class="copy-button"
          >
            Copy
          </button>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="quote-container">
        <p class="quote-text">"{{ randomQuote.quote }}"</p>
        <p class="quote-author">— {{ randomQuote.author }}</p>
      </div>

      <div class="footer">
        <button
          class="footer__button"
          @click="getAnother"
        >
          Get another
        </button>

        <button
          @click="copyToClipboard(randomQuote)"
          class="copy-button"
        >
          Copy Quote
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const error = ref(null);
const historyList = ref([]);
const randomQuote = ref({});
const API_QUOTES = "https://api.api-ninjas.com/v1/quotes";

async function fetchQuote() {
  try {
    error.value = null;

    const response = await axios.get(
      API_QUOTES,
      {
        headers: {
          "X-Api-Key": import.meta.env.VITE_URL_CODE,
        },
      }
    );

    return response.data[0];
  } catch (err) {
    error.value = "The citation could not be loaded. Please try again later.";
  }
}

async function getRandomQuote() {
  const quote = await fetchQuote();
  if (quote) {
    randomQuote.value = quote;
  }
}

function addToHistory() {
  if (historyList.value.length >= 10) {
    historyList.value.shift();
  }

  historyList.value.push(randomQuote.value);
}

onMounted(async () => {
  await getRandomQuote();
  addToHistory();
});

async function getAnother() {
  await getRandomQuote();
  addToHistory();
}

function copyToClipboard(value) {
  const textToCopy = `"${value.quote}" — ${value.author}`;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("Quote copied to clipboard!");
    })
    .catch((err) => {
      error.value = "Failed to copy text, need to reload page ";
    });
}
</script>

<style>
.error-message {
  color: red;
  font-size: 1.2em;
  text-align: center;
  margin-top: 20px;
}

.app {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.history {
  width: 40%;
}

.main {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.history__list {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.history__item {
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.quote-container {
  text-align: center;
}

.quote-text {
  font-size: 1.5em;
  font-weight: bold;
}

.quote-author {
  font-size: 1.2em;
  color: #555;
}

.footer {
  text-align: center;
  min-width: 130px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer__button,
.copy-button {
  padding: 10px 15px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s;
}

.footer__button {
  background-color: #4caf50;
  color: white;
}

.footer__button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.copy-button {
  background-color: #007bff;
  color: white;
}

.copy-button:hover {
  background-color: #0366d1;
  transform: scale(1.05);
}

.footer__button:active,
.copy-button:active {
  transform: scale(0.95);
}
</style>
