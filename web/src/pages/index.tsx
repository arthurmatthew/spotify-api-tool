import { AuthenticationPane } from "../components/AuthenticationPane";
import { UsersPane } from "../components/UsersPane";

export const IndexPage = () => {
  return (
    <div className="m-12 flex flex-col gap-6">
      <header>
        <AuthenticationPane />
      </header>
      <main className="flex flex-col gap-6">
        <h1 className="text-3xl">spotify-api-tool</h1>
        <UsersPane />
      </main>
      <footer></footer>
    </div>
  );
};
