import Link from 'next/link';
import { ReactElement } from 'react';

interface ComponentProps {
  children: ReactElement;
  showcase?: boolean;
}

const Layout: React.FC<ComponentProps> = ({ children, showcase = false }) => {
  return (
    <div className="antialiased">
      <header className="bg-purple-900 text-white">
        <div
          className={`container mx-auto px-4 ${
            showcase ? 'pt-32 pb-12' : 'pt-2 pb-2'
          }`}
        >
          {showcase ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight">
                Web Dev Lingo
              </h1>
              <h2 className="text-purple-300">
                A list of terms that only a web developer can understand.
              </h2>
            </>
          ) : (
            <>
              <div className="text-xl font-bold tracking-tight">
                <Link href="/">
                  <a>WDL</a>
                </Link>
              </div>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
