<div class="loading-container">
  <span class="spinner"></span>
</div>

<style lang="scss">
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top: 4px solid var(--accent-bright);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
