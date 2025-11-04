export default function ChangePassword() {
    return (
        <div className="max-w-md mx-auto mt-24 bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input type="password" className="input w-full" placeholder="Enter current password" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input type="password" className="input w-full" placeholder="Enter new password" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input type="password" className="input w-full" placeholder="Confirm new password" />
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" className="btn btn-ghost">Cancel</button>
                    <button type="submit" className="btn btn-primary">Update Password</button>
                </div>
            </form>
        </div>
    );
}
