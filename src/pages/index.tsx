import Link from "next/link";

export default function Index() {
  return (
    <div className="tortia-holder">
      <div className="tortia">
        <div className="btn">
          <Link href="/login">Get started</Link>
        </div>
      </div>
    </div>
  );
}
