// app/[locale]/index.tsx

export default function Page({ params }: { params: { locale: string } }) {
    const { locale } = params;  // Lấy giá trị locale từ URL (ví dụ: '/en', '/fr', '/de')
    
    return (
      <div>
        <h1>Current locale is: {locale}</h1>
      </div>
    );
  }
  