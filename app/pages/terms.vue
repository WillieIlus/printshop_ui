<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Hero / Header -->
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Terms of Service
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Please read these terms carefully before using Printy. By creating an account, you agree to be bound by these terms.
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
                These Terms of Service ("Terms") govern your use of Printy ("Service"), a pricing and quoting platform for print shops operated by Printy Inc. By accessing or using the Service, you agree to these Terms. If you do not agree, do not use the Service.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use after changes constitutes acceptance.
              </p>
            </div>
          </section>

          <section id="accounts" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Accounts
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                You must create an account to use certain features. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must provide accurate, current information and notify us promptly of any unauthorized access.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use the Service.
              </p>
            </div>
          </section>

          <section id="payments" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Payments
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Subscription fees, if applicable, are billed in advance on a monthly or annual basis. You authorize us to charge your payment method for all fees incurred. Refunds are handled according to our refund policy, which may be updated from time to time.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                All fees are in the currency specified at checkout. Prices may change with notice; continued use after a price increase constitutes acceptance.
              </p>
            </div>
          </section>

          <section id="templates" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Templates & Content
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Printy provides templates and pricing models for print jobs. You retain ownership of content you upload. By uploading content, you grant us a limited license to store, process, and display it as necessary to provide the Service.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                You may not upload content that infringes third-party rights, contains malware, or violates applicable law. We reserve the right to remove content that violates these Terms.
              </p>
            </div>
          </section>

          <section id="prohibited" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Prohibited Conduct
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                You agree not to: (a) reverse engineer, decompile, or disassemble the Service; (b) use the Service for any illegal purpose; (c) interfere with or disrupt the Service or servers; (d) attempt to gain unauthorized access to any part of the Service or other accounts; (e) use automated means to access the Service without our permission; (f) resell or sublicense the Service without authorization.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Violation of these restrictions may result in immediate termination of your account.
              </p>
            </div>
          </section>

          <section id="termination" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Termination
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                You may cancel your account at any time through your account settings. We may suspend or terminate your account for violation of these Terms, non-payment, or at our discretion with notice.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                Upon termination, your right to use the Service ceases. Provisions that by their nature should survive (including ownership, indemnification, and limitation of liability) will survive.
              </p>
            </div>
          </section>

          <section id="liability" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Limitation of Liability
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
              </p>
            </div>
          </section>

          <section id="contact" class="scroll-mt-24">
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Contact
              </h2>
              <p class="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Email: legal@printy.example.com<br>
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
  { id: 'accounts', label: 'Accounts' },
  { id: 'payments', label: 'Payments' },
  { id: 'templates', label: 'Templates & Content' },
  { id: 'prohibited', label: 'Prohibited Conduct' },
  { id: 'termination', label: 'Termination' },
  { id: 'liability', label: 'Liability' },
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
  title: 'Terms of Service - Printy',
  meta: [{ name: 'description', content: 'Terms of Service for Printy pricing and quoting platform.' }],
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
