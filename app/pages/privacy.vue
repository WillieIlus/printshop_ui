<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Hero / Header -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          We respect your privacy. This policy explains how we collect, use, and protect your information when you use Printy.
        </p>
        <p class="mt-4 text-sm text-gray-500 dark:text-gray-500">
          Last updated: February 21, 2025
        </p>
      </div>
    </header>

    <!-- Two-column layout -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <!-- Left nav: sticky on desktop, horizontal scroll on mobile -->
        <nav
          class="lg:sticky lg:top-6 lg:self-start mb-8 lg:mb-0"
          role="navigation"
        >
          <div class="flex overflow-x-auto gap-2 pb-2 lg:flex-col lg:overflow-visible lg:gap-1 scrollbar-hide">
            <a
              v-for="item in navItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal"
              :class="activeSection === item.id
                ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
              @click.prevent="scrollToSection(item.id)"
            >
              {{ item.label }}
            </a>
          </div>
        </nav>

        <!-- Right content -->
        <main class="space-y-12">
          <section id="overview" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Overview
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Printy Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our pricing and quoting platform ("Service"). By using the Service, you consent to the practices described in this policy.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We may update this policy from time to time. We will notify you of material changes by posting the updated policy and updating the "Last updated" date.
              </p>
            </div>
          </section>

          <section id="data-we-collect" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Data We Collect
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We collect information you provide directly, such as when you create an account, submit a quote request, or contact us. This may include:
              </p>
              <ul class="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Name, email address, and contact information</li>
                <li>Business name and shop details</li>
                <li>Payment and billing information</li>
                <li>Content you upload (templates, job specifications)</li>
                <li>Communications with us</li>
              </ul>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We also collect information automatically when you use the Service, including device information, IP address, browser type, and usage data.
              </p>
            </div>
          </section>

          <section id="how-we-use" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                How We Use Your Data
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul class="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section id="sharing" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Sharing Your Data
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul class="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Service providers</strong> who assist us in operating the Service (hosting, analytics, payment processing)</li>
                <li><strong>Other users</strong> when necessary to fulfill a quote request (e.g., sharing job details with a print shop)</li>
                <li><strong>Legal authorities</strong> when required by law or to protect our rights</li>
                <li><strong>Business transfers</strong> in connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We require third parties to protect your information and use it only for the purposes we specify.
              </p>
            </div>
          </section>

          <section id="cookies" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Cookies & Tracking
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We use cookies and similar technologies to provide and improve the Service. Cookies are small data files stored on your device. We use:
              </p>
              <ul class="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Essential cookies</strong> — Required for the Service to function (e.g., authentication, session management)</li>
                <li><strong>Analytics cookies</strong> — Help us understand how you use the Service</li>
                <li><strong>Preference cookies</strong> — Remember your settings (e.g., theme, language)</li>
              </ul>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                You can control cookies through your browser settings. Disabling certain cookies may affect Service functionality.
              </p>
            </div>
          </section>

          <section id="security" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Security
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit (TLS/HTTPS), secure authentication, and access controls.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                No method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section id="rights" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Your Rights
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Depending on your location, you may have the right to:
              </p>
              <ul class="mt-4 list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Access</strong> — Request a copy of your personal data</li>
                <li><strong>Correction</strong> — Request correction of inaccurate data</li>
                <li><strong>Deletion</strong> — Request deletion of your data</li>
                <li><strong>Portability</strong> — Receive your data in a portable format</li>
                <li><strong>Opt-out</strong> — Opt out of marketing communications</li>
                <li><strong>Object</strong> — Object to certain processing (where applicable)</li>
              </ul>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                To exercise these rights, contact us at privacy@printy.example.com. You may also have the right to lodge a complaint with a supervisory authority.
              </p>
            </div>
          </section>

          <section id="contact" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Contact
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                For privacy-related questions or to exercise your rights, please contact us at:
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Email: privacy@printy.example.com<br>
                Address: Printy Inc., 123 Print Street, Suite 100, City, State 12345
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'data-we-collect', label: 'Data We Collect' },
  { id: 'how-we-use', label: 'How We Use' },
  { id: 'sharing', label: 'Sharing' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'security', label: 'Security' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'contact', label: 'Contact' },
]

const route = useRoute()
const activeSection = ref<string | null>(null)

function scrollToSection(id: string) {
  if (import.meta.server) return
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${id}`)
    }
  }
}

function updateActiveSection() {
  if (import.meta.server) return
  const sections = navItems.map((i) => i.id)
  const scrollY = window.scrollY
  const headerOffset = 120

  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i])
    if (el && el.offsetTop - headerOffset <= scrollY) {
      activeSection.value = sections[i]
      return
    }
  }
  activeSection.value = sections[0]
}

onMounted(() => {
  const hash = route.hash?.replace('#', '')
  if (hash && navItems.some((i) => i.id === hash)) {
    nextTick(() => {
      scrollToSection(hash)
    })
  } else {
    activeSection.value = navItems[0].id
  }
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  window.addEventListener('resize', updateActiveSection)
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', updateActiveSection)
    window.removeEventListener('resize', updateActiveSection)
  }
})

useHead({
  title: 'Privacy Policy - Printy',
  meta: [{ name: 'description', content: 'Privacy Policy for Printy pricing and quoting platform.' }],
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
