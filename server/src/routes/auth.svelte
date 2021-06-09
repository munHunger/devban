<script context="module" lang="ts">
  export const load = async ({ session, page, fetch }) => {
    let token = page.query.get('token');
    const res = await fetch(`/auth.json?token=${encodeURIComponent(token)}`);

    if (res.ok) {
      let data = await res.json();
      return {
        props: {}
      };
    }
  };
</script>
