<template>
  <div class="dark:bg-[#19193f]">
    <div>
      <select v-model="colorMode.preference" class="w-20 h-20 dark:bg-[#19193f] ml-[50%] dark:text-white  border-none ">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <Items />
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode();

</script>
