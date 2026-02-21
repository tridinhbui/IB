import json
import re

def parse_ib_questions(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions_data = []
    current_category = "General"
    
    state = 'intro'
    temp_question = []
    temp_answer = []

    category_pattern = re.compile(r'(.+? Questions & (Suggested Answers|Answers)( – (Basic|Advanced))?)')
    # Use lstrip to handle form feeds
    question_start_pattern = re.compile(r'^(\d+)\.\s+(.+)')
    url_pattern = re.compile(r'http://(breakingintowallstreet\.com|www\.mergersandinquisitions\.com)')
    page_number_pattern = re.compile(r'^\s*\d+\s*$')

    def clean_text(text_list):
        cleaned = []
        for line in text_list:
            line = line.strip()
            if not line or url_pattern.search(line) or page_number_pattern.match(line):
                continue
            line = line.replace('\f', '')
            if line:
                cleaned.append(line)
        return " ".join(cleaned)

    def save_current():
        nonlocal temp_question, temp_answer
        if temp_question:
            questions_data.append({
                "category": current_category,
                "question": clean_text(temp_question),
                "answer": clean_text(temp_answer)
            })
            temp_question = []
            temp_answer = []

    for i, line in enumerate(lines):
        clean_line = line.replace('\f', '')
        striped_line = clean_line.strip()
        
        # Detect Category Header
        if "Fit / Qualitative Questions" in striped_line and len(striped_line) < 50:
            save_current()
            state = 'category'
            current_category = "Fit / Qualitative Questions"
            continue
            
        cat_match = category_pattern.search(striped_line)
        if cat_match and len(striped_line) < 100 and "...." not in striped_line:
            save_current()
            current_category = cat_match.group(1).strip()
            state = 'category'
            continue

        if state == 'intro':
            continue

        # Detect Question Start
        # Check start of line on clean_line (no \f)
        q_match = question_start_pattern.match(clean_line)
        if q_match:
            # It's a question if:
            # 1. State is 'category' (first question)
            # 2. Or there were blank lines above
            # 3. Or it ends with a ? or starts with "Walk me through"
            
            is_new_question = False
            if state == 'category':
                is_new_question = True
            else:
                # Check for blank line above
                has_blank_above = False
                for j in range(i-1, -1, -1):
                    prev = lines[j].replace('\f', '').strip()
                    if prev == "":
                        has_blank_above = True
                        break
                    if url_pattern.search(prev) or page_number_pattern.match(prev):
                        continue
                    break
                
                if has_blank_above:
                    is_new_question = True
                elif q_match.group(2).lower().startswith("walk me through"):
                    is_new_question = True
                elif "?" in q_match.group(2) or "?" in striped_line:
                    is_new_question = True
            
            if is_new_question:
                save_current()
                temp_question = [q_match.group(2)]
                state = 'question'
                continue

        # Handle Question Continuation or Answer Start
        if state == 'question':
            if striped_line == "":
                state = 'answer'
            else:
                temp_question.append(striped_line)
        elif state == 'answer':
            temp_answer.append(line)

    save_current()
    return questions_data

if __name__ == "__main__":
    filepath = "/Users/quangvictornguyen/Documents/IB/extracted_full.txt"
    output_path = "/Users/quangvictornguyen/Documents/IB/ib_questions.json"
    
    data = parse_ib_questions(filepath)
    
    final_data = []
    for item in data:
        q = item["question"]
        if len(q) < 10: continue
        # Filter out obvious list headers
        if q.endswith(":") and not "?" in q: continue
        final_data.append(item)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully extracted {len(final_data)} questions to {output_path}")
