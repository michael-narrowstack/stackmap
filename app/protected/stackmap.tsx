"use client"

import { stackmapId } from "./stackmap-select";
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Area from "./area";
import { Input } from "@/components/ui/input";

export default function Stackmap() {
    useSignals();
    const supabase = createClient();

    const [isCreating, setIsCreating] = useState(false);
    const [areas, setAreas] = useState([]);

    useSignalEffect(()=> {
        fetchAreas();
    });

    async function createArea(e: React.FormEvent){
        e.preventDefault();
        setIsCreating(false);

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const { data, error } = await supabase.from('areas').insert([{ name: name, stackmap_id: stackmapId.value }]).select();
        fetchAreas();
    }

    async function fetchAreas() {
        const { data, error } = await supabase.from('areas').select().eq('stackmap_id', stackmapId.value);
        setAreas(data as any); 
    }

    return (
        <div className="flex overflow-x-auto">
            {areas?.map((area) => (
                //@ts-ignore
                <Area key={area.id} name={area.name} />
            ))}

            <div className="flex justify-center items-center w-[144px] bg-[#1C2337] rounded-xl p-5 mx-1 shrink-0">
                {isCreating ? (
                    <form onSubmit={createArea}>
                        <Input type="text" name="name" />
                        <Button asChild><button type="submit">Create</button></Button>
                        <Button onClick={() => setIsCreating(false)}>x</Button>
                    </form>
                ):(
                    <Button onClick={() => setIsCreating(true)}>+</Button>
                )}
            </div>
        </div>
    );
}