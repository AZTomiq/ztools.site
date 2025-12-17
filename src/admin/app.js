const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const view = ref('dashboard'); // dashboard | editor | settings
    const features = ref([]);
    const searchQuery = ref('');
    const currentFeature = ref(null);
    const editorContent = ref('');
    const isSaving = ref(false);
    const toast = ref({ show: false, message: '', type: 'success' });

    // Global Settings State
    const globalConfig = ref({
      site: { url: '', author: '' },
      build: { locales: [], deploy: { strategy: 'init' } },
      categories: {}
    });

    // Computed
    const filteredFeatures = computed(() => {
      if (!searchQuery.value) return features.value;
      const q = searchQuery.value.toLowerCase();
      return features.value.filter(f =>
        f.id.toLowerCase().includes(q) ||
        (f.config.meta && f.config.meta.title_vi.toLowerCase().includes(q))
      );
    });

    // Methods
    const showToast = (msg, type = 'success') => {
      toast.value = { show: true, message: msg, type };
      setTimeout(() => toast.value.show = false, 3000);
    };

    const fetchFeatures = async () => {
      try {
        const res = await fetch('/api/features');
        if (!res.ok) throw new Error('Failed to fetch features');
        features.value = await res.json();
      } catch (err) {
        showToast(err.message, 'error');
      }
    };

    const fetchGlobal = async () => {
      try {
        const res = await fetch('/api/global');
        if (!res.ok) throw new Error('Failed to fetch global settings');
        globalConfig.value = await res.json();
      } catch (err) {
        showToast(err.message, 'error');
      }
    };

    const openEditor = (feature) => {
      currentFeature.value = feature;
      editorContent.value = JSON.stringify(feature.config, null, 2);
      view.value = 'editor';
    };

    const closeEditor = () => {
      view.value = 'dashboard';
      currentFeature.value = null;
    };

    const saveFeature = async () => {
      if (!currentFeature.value) return;
      isSaving.value = true;

      try {
        // If using JSON editor mode (optional in future), we might need to parse editorContent
        // But for now we bind directly to currentFeature.config in the Form

        const res = await fetch(`/api/features/${currentFeature.value.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentFeature.value.config)
        });

        if (!res.ok) throw new Error('Failed to save');

        showToast('Saved successfully! Rebuilding...', 'success');
        await fetchFeatures();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        isSaving.value = false;
      }
    };

    const saveGlobal = async () => {
      isSaving.value = true;
      try {
        // Ensure array for locales if string
        // But v-model will handle it if we bind correctly or use split
        // We'll trust the binding structure for now.

        const res = await fetch('/api/global', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(globalConfig.value)
        });

        if (!res.ok) throw new Error('Failed to save global settings');

        showToast('Global settings saved! Rebuilding...', 'success');
        await fetchGlobal();
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        isSaving.value = false;
      }
    };

    // Navigation Handler
    const navigateTo = (v) => {
      view.value = v;
      if (v === 'settings') fetchGlobal();
      if (v === 'dashboard') fetchFeatures();
    };

    onMounted(() => {
      fetchFeatures();
      fetchGlobal();

      // Mouse track for card glow effect
      document.body.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', e.clientX + 'px');
        document.body.style.setProperty('--mouse-y', e.clientY + 'px');
      });
    });

    return {
      view,
      features,
      searchQuery,
      filteredFeatures,
      currentFeature,
      editorContent,
      isSaving,
      toast,
      globalConfig,
      openEditor,
      closeEditor,
      saveFeature,
      saveGlobal,
      navigateTo
    };
  }
}).mount('#app');
