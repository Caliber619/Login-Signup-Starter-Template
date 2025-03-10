import { 
    addDoc, collection, getDocs, doc, updateDoc, deleteDoc, query, where 
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const TeamManagement = ({ user }) => {
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState([{ name: "", phone: "" }]);
    const [phone, setPhone] = useState("");
    const [teams, setTeams] = useState([]);
    const [editTeamId, setEditTeamId] = useState(null);

    const navigate = useNavigate();

    // Fetch only the logged-in user's teams
    const fetchTeams = async () => {
        if (!user) return;

        const q = query(collection(db, "teams"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setTeams(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        fetchTeams();
    }, [user]);

    // Handle adding or updating a team
    const handleSaveTeam = async () => {
        if (!teamName.trim() || members.length === 0 || !phone.trim()) {
            alert("Please fill in all fields!");
            return;
        }

        if (!user) {
            alert("You must be logged in!");
            return;
        }

        const teamData = {
            teamName,
            members,
            phone,
            userId: user.uid, // Store user ID with the team
        };

        if (editTeamId) {
            const teamRef = doc(db, "teams", editTeamId);
            await updateDoc(teamRef, teamData);
        } else {
            await addDoc(collection(db, "teams"), teamData);
        }

        fetchTeams();
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setTeamName("");
        setMembers([{ name: "", phone: "" }]);
        setPhone("");
        setEditTeamId(null);
    };

    // Edit a team
    const handleEditTeam = (team) => {
        if (team.userId !== user.uid) {
            alert("You can only edit your own teams!");
            return;
        }

        setTeamName(team.teamName);
        setMembers(team.members);
        setPhone(team.phone);
        setEditTeamId(team.id);
    };

    // Delete a team (only if user created it)
    const handleDeleteTeam = async (teamId) => {
        const team = teams.find(t => t.id === teamId);

        if (team.userId !== user.uid) {
            alert("You can only delete your own teams!");
            return;
        }

        await deleteDoc(doc(db, "teams", teamId));
        fetchTeams();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold">Hello, {user?.displayName || "User"}</h2>
                <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>

            <div className="bg-white shadow-md p-6 rounded-lg mt-6 max-w-lg mx-auto">
                <h2 className="text-2xl font-semibold mb-4">{editTeamId ? "Edit Team" : "Create Team"}</h2>

                <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                />

                <input
                    type="text"
                    placeholder="Main Contact"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                />

                <button onClick={handleSaveTeam} className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4">
                    {editTeamId ? "Update Team" : "Add Team"}
                </button>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Your Teams</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {teams.map((team) => (
                        <div key={team.id} className="bg-white shadow-md p-4 rounded-lg">
                            <h3 className="text-xl font-semibold">{team.teamName}</h3>
                            <p className="text-gray-500">Contact: {team.phone}</p>
                            <div className="mt-3 flex space-x-2">
                                <button onClick={() => handleEditTeam(team)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteTeam(team.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;