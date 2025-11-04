export default function ChangeEmail() {
    return (
        <div className="max-w-md mx-auto mt-24 bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-semibold mb-4">Change Email</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">New Email</label>
                    <input type="email" className="input w-full" placeholder="Enter new email address" />
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" className="btn btn-ghost">Cancel</button>
                    <button type="submit" className="btn btn-primary">Update Email</button>
                </div>
            </form>
        </div>
    );
}
