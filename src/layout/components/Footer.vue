<template functional>
  <div class="layout-footer">
    <div class="text">
      © <span>Fenghan</span> 2020-2021, powered by
      <span>Vue & Nest</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-footer {
  grid-area: footer;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: var(--font-smaller);
  letter-spacing: 1px;
  .text {
    padding: 1rem;
    color: var(--gray);
    span {
      font-weight: 500;
    }
  }
}
body.dark-mode .text {
  color: var(--gray-dark);
}
</style>
