<script setup>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const toast = useToast();

// Main address
const address = ref({
  phone: "",
  pincode: "",
  house: "",
  area: "",
  city: "",
  state: ""
});

// Billing address
const billingAddress = ref({
  pincode: "",
  house: "",
  area: "",
  city: "",
  state: ""
});

// Checkbox state
const sameAsUser = ref(false);

// When checkbox clicked, copy values
watch(sameAsUser, (val) => {
  if (val) {
    billingAddress.value = { ...address.value };
  }
});

// Save to MongoDB
async function saveAddress() {
  const user = auth.currentUser;
  if (!user) {
    return toast.warning({title:"Login",message:"Please login first",timeout:3000});
  }

  try {
    await $fetch("http://localhost:2500/server/ecommerce/StoreUser", {
      method: "POST",
      body: {
       uid: user.uid,
        email: user.email,
        name: user.displayName || "",

        // Address data you entered
        phone: address.value.phone,
        pincode: address.value.pincode,
        house: address.value.house,
        area: address.value.area,
        city: address.value.city,
        state: address.value.state,
        
      }
    });

    toast.success({title:"Success",message:"Address saved successfully!",timeout:3000});
  } catch (err) {
    console.error("Save error:", err);
    toast.error({title:"Error",message:"Error saving address",timeout:3000});
  }
}
</script>


<template>
  <div class="p-6 max-w-xl mx-auto">

    <h1 class="text-xl font-bold mb-4">Shipping Address</h1>

    <div class="space-y-3 border p-4 rounded">

      <input v-model="address.phone" placeholder="Phone Number" class="border p-2 w-full" />

      <input v-model="address.pincode" placeholder="Pincode" class="border p-2 w-full" />

      <input v-model="address.house" placeholder="House / Flat No." class="border p-2 w-full" />

      <input v-model="address.area" placeholder="Area / Landmark" class="border p-2 w-full" />

      <input v-model="address.city" placeholder="City" class="border p-2 w-full" />

      <input v-model="address.state" placeholder="State" class="border p-2 w-full" />
    </div>

   
    <button class="bg-blue-600 text-white w-full py-2 mt-6 rounded"
            @click="saveAddress">
      Save Address
    </button>

  </div>
</template>
