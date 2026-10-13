export const instant = false;
export default async function UserProfile({ params }: any) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
      <h1 className="text-4xl font-bold mb-2">Profile</h1>
      <hr />
      <p className="text-4xl ">
        Profile page
        <span className="p-2 rounded-lg bg-orange-100 text-black ml-2.5">
          {id}
        </span>
      </p>
    </div>
  );
}
