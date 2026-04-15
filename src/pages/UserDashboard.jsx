import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BarChart3, MessageSquare, MoreHorizontal, Sparkles } from "lucide-react";
import axiosClient from "../services/axiosClient";

const UserDashboard = () => {
  const [selectedMood, setSelectedMood] = useState("");

  const moods = [
    { name: "Terrible", emoji: "😞", value: "terrible", color: "mood-terrible" },
    { name: "Bad", emoji: "😟", value: "bad", color: "mood-bad" },
    { name: "Okay", emoji: "🙂", value: "okay", color: "mood-okay" },
    { name: "Good", emoji: "😄", value: "good", color: "mood-good" },
    { name: "Excellent", emoji: "🌟", value: "excellent", color: "mood-excellent" },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Mock mood logging
    console.log(`Logged mood: ${mood}`);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            How are you today, <span className="text-primary">Sarah</span>? 
          </h1>
          <p className="text-muted-foreground">
            Track your mood and discover patterns in your wellness journey
          </p>
        </div>

        {/* Mood Selection */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Today's Mood</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                variant="outline"
                className={`mood-button ${mood.color} h-auto flex-col space-y-2 ${
                  selectedMood === mood.value ? "ring-2 ring-primary shadow-mood" : ""
                }`}
                onClick={() => handleMoodSelect(mood.value)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.name}</span>
              </Button>
            ))}
          </div>
          {selectedMood && (
            <div className="mt-4 p-4 bg-primary-soft rounded-xl">
              <p className="text-primary font-medium">
                ✨ Great! You've logged your mood for today. Keep building that streak!
              </p>
            </div>
          )}
        </Card>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Weekly Mood Summary</h3>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Excellent 🌟</span>
                <Badge variant="secondary">3 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Good 😄</span>
                <Badge variant="secondary">2 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Okay 🙂</span>
                <Badge variant="secondary">2 days</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              You're having a great week! 💜
            </p>
          </Card>

          {/* Streak Tracker */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Current Streak</h3>
              <Sparkles className="w-5 h-5 text-success" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">3</div>
              <p className="text-success font-medium">Day Happy Streak! 🎉</p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep it going! Positive streaks help build resilience.
              </p>
            </div>
          </Card>

          {/* Mood Pattern Alert */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Pattern Insight</h3>
              <MessageSquare className="w-5 h-5 text-supportive" />
            </div>
            <div className="bg-supportive/10 p-4 rounded-xl">
              <p className="text-sm text-supportive-foreground font-medium mb-2">
                🌸 Notice & Nurture
              </p>
              <p className="text-sm text-muted-foreground">
                Your mood tends to improve on days when you log earlier. 
                Try morning check-ins for best results!
              </p>
            </div>
          </Card>
        </div>

        {/* Motivational Section */}
        <Card className="p-6 mb-8 bg-gradient-mood text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Today's Inspiration</h3>
              <p className="text-white/90 mb-4">
                "Every small step you take towards understanding your emotions 
                is a victory worth celebrating. You're doing great!" 
              </p>
              <Button variant="secondary" size="sm">
                Explore Resources
              </Button>
            </div>
            <Sparkles className="w-8 h-8 text-white/80 ml-4" />
          </div>
        </Card>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-around py-4">
              <Button variant="ghost" size="sm" className="flex-col space-y-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Entries</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col space-y-1 text-primary">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">Stats</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col space-y-1">
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Calendar</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex-col space-y-1">
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-xs">More</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
